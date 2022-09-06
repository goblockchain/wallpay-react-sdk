import React, { useEffect } from "react";
import { PAYMENT_STEPS } from "../enums";
import { useNotification } from "../hooks/useNotification";
import { sleep } from "../utils";
import { redeemToken } from "../utils/api";

function HandleConfirmCredit({
  sdkPrivateKey,
  router,
  imageURL,
  creditCardConfirmUrl,
}: {
  sdkPrivateKey: string;
  router: any;
  imageURL: string;
  creditCardConfirmUrl?: string;
}) {
  const { emitNotificationModal } = useNotification();
  const replaceUrl = creditCardConfirmUrl || window.location.href;
  let anyerror = false;
  useEffect(() => {
    const confirm = async () => {
      try {
        if (router.query.payment_intent !== undefined) {
          emitNotificationModal({
            type: PAYMENT_STEPS.IN_PROGRESS,
          });
          emitNotificationModal({
            type: PAYMENT_STEPS.PROCESSING,
          });
          const red = await redeemToken(
            {
              ...router.query,
              stripeId: router.query.payment_intent,
            },
            sdkPrivateKey
          );
          router.replace(replaceUrl);
          if (!anyerror) {
            emitNotificationModal({
              type: PAYMENT_STEPS.SUCCESS,
              image: imageURL,
            });
          }
        }
        // }
      } catch (error) {
        if (
          // @ts-ignore
          error.response.data.message.includes("E11000 duplicate key error")
        ) {
          return;
        }
        router.replace(replaceUrl);
        anyerror = true;
        const primaryText = "Ocorreu um erro ao processar o pagamento";
        const secondaryText = "Tente novamente mais tarde";
        emitNotificationModal({
          type: PAYMENT_STEPS.TIMEOUT,
          message: { primaryText, secondaryText },
        });
      }
    };
    confirm();
  }, [router]);

  return <></>;
}

export default HandleConfirmCredit;
