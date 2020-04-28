import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Peer1Component } from './peer1/peer1.component';
import { Peer2Component } from './peer2/peer2.component';

const routes: Routes = [
  { path: 'peer1', component: Peer1Component },
  { path: 'peer2', component: Peer2Component },
  { path: '**', component: Peer1Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
