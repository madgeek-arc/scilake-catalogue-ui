import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {FormArray, FormControl, FormGroup, FormGroupDirective} from "@angular/forms";
import {Field, HandleBitSet} from "../../../../domain/dynamic-form-model";
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {FormControlService} from "../../../../services/form-control.service";

@Component({
  selector: 'app-rich-text-field',
  templateUrl: './rich-text-field.component.html'
})

export class RichTextFieldComponent implements OnInit {
  @Input() fieldData: Field;
  @Input() editMode: any;
  @Input() position?: number = null;

  @Output() hasChanges = new EventEmitter<boolean>();
  @Output() handleBitSets = new EventEmitter<Field>();
  @Output() handleBitSetsOfComposite = new EventEmitter<HandleBitSet>();

  formControl!: FormControl;
  form!: FormGroup;
  hideField: boolean = null;

  public editor = ClassicEditor;

  constructor(private rootFormGroup: FormGroupDirective, private formControlService: FormControlService) {
  }

  ngOnInit() {
    if (this.position !== null) {
      this.form = this.rootFormGroup.control.controls[this.position] as FormGroup;
    } else {
      this.form = this.rootFormGroup.control;
    }
    // console.log(this.form);

    this.formControl = this.form.get(this.fieldData.name) as FormControl;
    // console.log(this.formControl);

    if(this.fieldData.form.dependsOn) {
      // console.log(this.fieldData.form.dependsOn);
      this.enableDisableField(this.form.get(this.fieldData.form.dependsOn.name).value, this.fieldData.form.dependsOn.value);
      // console.log(this.fieldData.name);
      this.form.get(this.fieldData.form.dependsOn.name).valueChanges.subscribe(
        value => {
          this.enableDisableField(value, this.fieldData.form.dependsOn.value);
        },
        error => {console.log(error)}
      );
    }
  }

  /** Handle Arrays --> **/

  fieldAsFormArray() {
    return this.formControl as unknown as FormArray;
  }

  push() {
    this.fieldAsFormArray().push(this.formControlService.createField(this.fieldData));
  }

  remove(field: string, i: number) {
    this.fieldAsFormArray().removeAt(i);
  }

  /** check fields validity--> **/

  checkFormValidity(): boolean {
    return (!this.formControl.valid && (this.formControl.touched || this.formControl.dirty));
  }


  /** Bitsets--> **/

  updateBitSet(fieldData: Field) {
    this.timeOut(200).then(() => { // Needed for radio buttons strange behaviour
      if (fieldData.form.mandatory) {
        this.handleBitSets.emit(fieldData);
      }
    });
  }

  /** other stuff--> **/
  unsavedChangesPrompt() {
    this.hasChanges.emit(true);
  }

  timeOut(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  enableDisableField(value, enableValue) {
    if (value?.toString() == enableValue) {
      this.formControl.enable();
      this.hideField = false;
    } else {
      this.formControl.disable();
      this.formControl.reset();
      this.hideField = true;
      // maybe add this if the remaining empty fields are a problem
      // (this.formControl as unknown as FormArray).clear();
    }
  }

}


