import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EconomiaCircComponent } from './economia-circ.component';

describe('EconomiaCircComponent', () => {
  let component: EconomiaCircComponent;
  let fixture: ComponentFixture<EconomiaCircComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EconomiaCircComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EconomiaCircComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
