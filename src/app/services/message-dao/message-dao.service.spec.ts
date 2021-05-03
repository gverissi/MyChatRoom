import { TestBed } from '@angular/core/testing';

import { MessageDaoService } from './message-dao.service';

describe('MessageDaoService', () => {
  let service: MessageDaoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessageDaoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
