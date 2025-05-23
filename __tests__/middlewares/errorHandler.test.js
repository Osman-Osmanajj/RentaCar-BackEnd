// __tests__/middlewares/errorHandler.test.js
import { errorHandler } from '../../middlewares/errorHandler.js';

describe('errorHandler middleware', () => {
  let res, statusMock, jsonMock;
  let consoleErrorSpy;

  beforeEach(() => {
    statusMock = jest.fn().mockReturnThis();
    jsonMock   = jest.fn();
    res = {
      status: statusMock,
      json:   jsonMock
    };
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('uses err.statusCode and includes details when not in production', () => {
    process.env.NODE_ENV = 'development';  // ensure non-production
    const err = new Error('Bad data');
    err.statusCode = 400;
    err.details = ['field1 required', 'field2 invalid'];

    errorHandler(err, {}, res, () => {});

    expect(consoleErrorSpy).toHaveBeenCalledWith(err);
    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      message: 'Bad data',
      details: ['field1 required', 'field2 invalid']
    });
  });

  it('defaults to 500 and "Internal Server Error" when message is empty and omits details by default', () => {
    process.env.NODE_ENV = 'development';
    const err = new Error();  // message === ''
    // no statusCode, no details

    errorHandler(err, {}, res, () => {});

    expect(consoleErrorSpy).toHaveBeenCalledWith(err);
    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      message: 'Internal Server Error'
    });
  });

  it('omits details when in production even if err.details exist', () => {
    process.env.NODE_ENV = 'production';
    const err = new Error('Prod error');
    err.statusCode = 422;
    err.details = ['secret info'];

    errorHandler(err, {}, res, () => {});

    expect(consoleErrorSpy).toHaveBeenCalledWith(err);
    expect(statusMock).toHaveBeenCalledWith(422);
    expect(jsonMock).toHaveBeenCalledWith({
      message: 'Prod error'
      // no details key
    });
  });
});
