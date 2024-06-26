/*
 * Copyright 2021-2024 OpenAIRE AMKE
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {Component} from "@angular/core";
import {LandingPageService} from "../../../../catalogue-ui/services/landing-page.service";
import {LandingPageComponent} from "../../../../catalogue-ui/pages/landingpages/dataset/landing-page.component";
import {environment} from "../../../../../environments/environment";
import {ActivatedRoute, Router} from "@angular/router";
import {NavigationService} from "../../../services/navigation.service";
import {UserService} from "../../../services/user.service";
import {UserInfo} from "../../../domain/userInfo";
import {ResourcePayloadService} from "../../../services/resource-payload.service";
import {Paging} from "../../../../catalogue-ui/domain/paging";
import {AuthenticationService} from "../../../services/authentication.service";

declare var UIkit: any;

@Component({
  selector: 'pages-dataset',
  templateUrl: 'dataset-landing-page.component.html',
  providers: [LandingPageService, ResourcePayloadService]
})

export class DatasetLandingPageComponent extends LandingPageComponent {

  userInfo: UserInfo = null;
  projectName: string = null;
  tools: Paging<any> = null;

  constructor(protected override route: ActivatedRoute,
              protected override landingPageService: LandingPageService,
              protected navigationService: NavigationService,
              protected router: Router, private authService: AuthenticationService,
              protected userService: UserService,
              protected resourcePayloadService: ResourcePayloadService) {
    super(route, landingPageService)
  }

  override ngOnInit() {
    super.ngOnInit();
    this.projectName = environment.projectName;
    if (this.userService.userInfo !== null) {
      this.userInfo = this.userService.userInfo;
    } else {
      this.subscriptions.push(
        this.userService.getUserInfo().subscribe(
          res => {
            this.userInfo = res;
            this.userService.roleToSessionStorage(res);
          },
          error => {
            console.log(error);
            this.userService.clearUserInfo();
          }
        )
      );
    }
    this.route.params.subscribe(params => {
      this.resourcePayloadService.getItemsByResourceType('tool', params['id']).subscribe(
        next => {
          this.tools = next;
        },
        error => {console.log(error);}
      )
    });
  }

  gotoRequestData(instanceVersion, datasetId) {
    console.log('running on landing page');
    UIkit.modal('#modal-dataset-instances').hide();
    this.navigationService.setDataRequestIds(instanceVersion, datasetId);
    this.router.navigate([`/request-data`]).then();
  }

  deleteItem() {
    this.resourcePayloadService.deleteItem(this.dataset['id'], 'dataset_type').subscribe(
      res => {
        // UIkit.modal('#delete-modal').hide();
        this.router.navigate([`/search`]);
      },
      error => {
        // UIkit.modal('#delete-modal').hide();
        console.error(error);
      }
    );
  }

  hasRole() {
    return this.authService.userRoles.includes('OPERATOR_DATASET-INGESTOR');
  }

  download(url: string) {
    window.open(url, '_blank');
  }

}
