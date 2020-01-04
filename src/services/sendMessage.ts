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
  if (trainee.getMissSoldierClassCd() !== SoldierClass['예비군인/훈련병']) {
    throw new Error('예비군인/훈련병에게만 편지를 보낼 수 있습니다.');
  }

  const options = {
    uri: buildRequestUrl('consolLetter/insertConsolLetterA.do?'),
    method: 'POST',
    json: true,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Cookie: `iuid=${cookies.iuid};`,
    },
    form: {
      traineeMgrSeq: message.getTraineeMgrSeq(),
      sympathyLetterContent: message.getSympathyLetterContent(),
      sympathyLetterSubject: message.getSympathyLetterSubject(),
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
      throw new Error(body.resultMsg || '알 수 없는 에러.');
    }
  });

  if (!response) {
    throw new Error('응답 값이 없습니다.');
  }

  return true;
}

export { sendMessage };
