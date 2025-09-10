import { TestBed } from '@angular/core/testing';

import { SensorCamera } from './sensor-camera';

describe('SensorCamera', () => {
  let service: SensorCamera;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SensorCamera);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
