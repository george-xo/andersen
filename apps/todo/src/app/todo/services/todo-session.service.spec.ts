import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { TodoSessionService } from './todo-session.service';

const TOKEN = 'token-123';

describe('TodoSessionService', () => {
  let service: TodoSessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TodoSessionService],
    });

    service = TestBed.inject(TodoSessionService);
  });

  it('should have null token by default', () => {
    expect(service.getToken()).toBeNull();
  });

  it('should store token', () => {
    service.setToken(TOKEN);

    expect(service.getToken()).toBe(TOKEN);
  });

  it('should clear token', () => {
    service.setToken(TOKEN);

    service.clearToken();

    expect(service.getToken()).toBeNull();
  });
});
