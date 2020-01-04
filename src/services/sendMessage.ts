import requestPromise from 'request-promise';

import { Soldier, Message, Cookie, SoldierClass } from '../models';
import { buildRequestUrl, addLog } from '../utils';

/**
 * 인터넷 편지를 전송한다.
 * @param cookies - 세션 식별을 위한 쿠키
 * @param trainee - 훈련병 정보
 * @param message - 인터넷 편지 정보
 */
async function sendMessage(cookies: Cookie, trainee: Soldier, message: Message) {
  if (trainee.missSoldierClassCd !== SoldierClass['예비군인/훈련병']) {
    throw new Error('예비군인/훈련병에게만 편지를 보낼 수 있습니다.');
  }

  const { traineeMgrSeq, sympathyLetterSubject, sympathyLetterContent } = message;
  const options = {
    uri: buildRequestUrl('consolLetter/insertConsolLetterA.do?'),
    method: 'POST',
    json: true,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Cookie: `iuid=${cookies.iuid};`,
    },
    form: {
      traineeMgrSeq,
      sympathyLetterContent,
      sympathyLetterSubject,
      boardDiv: 'sympathyLetter',
      tempSaveYn: 'N',
    },
  };

  const response = await requestPromise(options, (err, res, body) => {
    if (err) {
      throw new Error(err);
    }

    addLog('sendMessage', `${res.statusCode} ${res.statusMessage}`);

    if (res.statusCode === 200 && body.resultCd !== '0000') {
      throw new Error(body.resultMessage || 'Unknown error.');
    }
  });

  if (!response) {
    throw new Error('Response is null.');
  }

  return true;
}

export { sendMessage };
