import requestPromise from 'request-promise';

import { Cookie } from '../models';
import { addLog, buildRequestUrl } from '../utils';

/**
 * 더 캠프에 로그인해 세션 쿠키를 얻는다.
 * @param id - 계정 아이디
 * @param password - 계정 비밀번호
 */
async function login(id: string, password: string) {
  const options = {
    url: buildRequestUrl('login/loginA.do'),
    method: 'POST',
    json: true,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    form: {
      state: 'email-login',
      autoLoginYn: 'N',
      userId: id,
      userPwd: password,
    },
  };

  const response = await requestPromise(options, (err, res, body) => {
    if (err) {
      throw new Error(err);
    }

    addLog('login', `${res.statusCode} ${res.statusMessage}`);

    if (res.statusCode === 200 && body.resultCd !== '0000') {
      throw new Error(body.resultMsg || '알 수 없는 에러.');
    }

    if (!body.iuid) {
      throw new Error('쿠키를 찾을 수 없습니다.');
    }
  });

  if (!response) {
    throw new Error('응답 값이 없습니다.');
  }

  const result: Cookie = { iuid: response.iuid };

  return result;
}

export { login };
