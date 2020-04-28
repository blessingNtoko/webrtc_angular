import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Peer1Component } from './peer1.component';

describe('Peer1Component', () => {
  let component: Peer1Component;
  let fixture: ComponentFixture<Peer1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Peer1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Peer1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
