import React, { useEffect } from "react";
import { PAYMENT_STEPS } from "../enums";
import { useNotification } from "../hooks/useNotification";
import { sleep } from "../utils";
import { redeemToken } from "../utils/api";

function HandleConfirmCredit({
  sdkPrivateKey,
  router,
  imageURL,
}: {
  sdkPrivateKey: string;
  router: any;
  imageURL: string;
}) {
  const { emitNotificationModal } = useNotification();

  let anyerror = false;
  useEffect(() => {
    const confirm = async () => {
      try {
        if (router.query.payment_intent !== undefined) {
          emitNotificationModal({
            type: PAYMENT_STEPS.IN_PROGRESS,
          });
          // if (router.query.coemaluco != "true") {
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
          router.replace("/");
          if (!anyerror) {
            emitNotificationModal({
              type: PAYMENT_STEPS.SUCCESS,
              image: imageURL,
            });
          }
        }
        // }
      } catch (error) {
        // @ts-ignore
        if(error.response.data.message.includes("E11000 duplicate key error")){
          return;
        }
        router.replace("/");
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
