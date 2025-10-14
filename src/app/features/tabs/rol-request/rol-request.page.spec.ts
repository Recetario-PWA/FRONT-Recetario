import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RolRequestPage } from './rol-request.page';

describe('RolRequestPage', () => {
  let component: RolRequestPage;
  let fixture: ComponentFixture<RolRequestPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RolRequestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
