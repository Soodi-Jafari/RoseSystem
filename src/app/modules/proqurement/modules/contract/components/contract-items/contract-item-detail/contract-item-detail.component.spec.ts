import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractItemDetailComponent } from './contract-item-detail.component';

describe('ContractItemDetailComponent', () => {
  let component: ContractItemDetailComponent;
  let fixture: ComponentFixture<ContractItemDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractItemDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractItemDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
