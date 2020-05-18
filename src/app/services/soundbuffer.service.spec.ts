import { TestBed } from '@angular/core/testing';

import { SoundbufferService } from './soundbuffer.service';

describe('SoundbufferService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SoundbufferService = TestBed.get(SoundbufferService);
    expect(service).toBeTruthy();
  });
});
