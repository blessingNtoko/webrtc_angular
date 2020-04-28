import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Peer2Component } from './peer2.component';

describe('Peer2Component', () => {
  let component: Peer2Component;
  let fixture: ComponentFixture<Peer2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Peer2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Peer2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
