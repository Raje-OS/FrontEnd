import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibraryStatisticsComponent } from './library-statistics.component';

describe('LibraryStatisticsComponent', () => {
  let component: LibraryStatisticsComponent;
  let fixture: ComponentFixture<LibraryStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibraryStatisticsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LibraryStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
