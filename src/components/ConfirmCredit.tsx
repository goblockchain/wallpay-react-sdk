import React, { useEffect } from 'react';
import { PAYMENT_STEPS } from '../enums';
import { useNotification } from '../hooks/useNotification';
import { redeemToken } from '../utils/api';

function HandleConfirmCredit({ sdkPrivateKey, router, imageURL }: {
  sdkPrivateKey: string;
  router: any;
  imageURL: string;
}) {
  const { emitNotificationModal } = useNotification();

  useEffect(() => {
    if (router.query.payment_intent !== undefined) {
      emitNotificationModal({
        type: PAYMENT_STEPS.IN_PROGRESS,
      });
      redeemToken({
        ...router.query,
        stripeId: router.query.payment_intent,
      }, sdkPrivateKey)
        .then(() => {
          router.replace('/');
          emitNotificationModal({
            type: PAYMENT_STEPS.SUCCESS,
            image: imageURL,
          });
        });
    }
  }, [router]);

  return <></>;
};

export default HandleConfirmCredit;
