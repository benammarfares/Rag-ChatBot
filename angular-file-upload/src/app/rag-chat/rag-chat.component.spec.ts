import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RagChatComponent } from './rag-chat.component';

describe('RagChatComponent', () => {
  let component: RagChatComponent;
  let fixture: ComponentFixture<RagChatComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RagChatComponent]
    });
    fixture = TestBed.createComponent(RagChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
