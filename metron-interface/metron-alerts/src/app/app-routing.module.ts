/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuard} from './shared/auth-guard';
import {LoginGuard} from './shared/login-guard';

const routes: Routes = [
  { path: '',  redirectTo: 'login', pathMatch: 'full'},
  { path: 'login', loadChildren: 'app/login/login.module#LoginModule', canActivate: [LoginGuard]},
  { path: 'alerts-list', loadChildren: 'app/alerts/alerts-list/alerts-list.module#AlertsListModule', canActivate: [AuthGuard]},
  { path: 'save-search', loadChildren: 'app/alerts/save-search/save-search.module#SaveSearchModule', canActivate: [AuthGuard]},
  { path: 'saved-searches', loadChildren: 'app/alerts/saved-searches/saved-searches.module.ts#SavedSearchesModule',
      canActivate: [AuthGuard]},
  { path: 'pcap', loadChildren: 'app/pcap/pcap.module#PcapModule', canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class MetronAlertsRoutingModule { }
