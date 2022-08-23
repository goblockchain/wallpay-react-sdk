import React, { useEffect } from 'react';
import { PAYMENT_STEPS } from '../enums';
import { useNotification } from '../hooks/useNotification';
import { redeemToken } from '../utils/api';

function HandleConfirmCredit({ sdkPrivateKey, router }: {
  sdkPrivateKey: string;
  router: any;
}) {
  const { emitNotificationModal } = useNotification();

  useEffect(() => {
    console.log('router.query @ ConfirmCredit', router.query);
    if (router.query.payment_intent !== undefined) {
      emitNotificationModal({
        type: PAYMENT_STEPS.IN_PROGRESS,
      });
      redeemToken(router.query, sdkPrivateKey)
        .then(() => {
          emitNotificationModal({
            type: PAYMENT_STEPS.SUCCESS,
          });
        });
    }
  }, [router]);

  return <></>;
};

export default HandleConfirmCredit;