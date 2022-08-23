import React, { createContext, useContext, useEffect, useState } from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  useDisclosure,
  Box,
  Flex,
  Image,
  Text,
  Spinner,
  Center,
  Button,
  ChakraProvider
} from "@chakra-ui/react";
import wallpayLogo from "../assets/wallpay.png";

import { useConfig } from "./useConfig";
import { ERRORS, PAYMENT_STEPS, EMAIL_STATUS } from "../enums";
import { useLanguageQuery, useTranslation } from "next-export-i18n";
import Lottie from "react-lottie";

// @ts-ignore
import processing from "../assets/lotties/processando.json";
// @ts-ignore
import oops from "../assets/lotties/oops.json";

import end_succ from "../assets/progress/end_succ.svg";
import process_succ from "../assets/progress/process_succ.svg";
import process_fail from "../assets/progress/process_fail.svg";
import transf_succ from "../assets/progress/transf_succ.svg";
import { theme } from "../styles/theme";
import Link from "next/link";
import router from "next/router";

// import badstatus from "../../public/bad-status.png";
// import success from "../../public/success-status.png";
// import erro from "../../public/error-status.png";

type NotificationData = {
  borderColor?: string;

  progressImg?: any;
  nftImage?: any;
  lottieSrc?: any;

  heading: string;
  primaryText: string;
  secondaryText: string;

  canClose?: boolean;
};

type Message = {
  primaryText?: string;
  secondaryText?: string;
};

type EmitNotificationModalArgs = {
  type?: string;
  message?: Message;
  image?: string;
};

type EmitNotificationModal = ({
  message,
  type,
  image,
}: EmitNotificationModalArgs) => void;

export interface INotificationContext {
  emitNotificationModal: EmitNotificationModal;
  onCloseModificationModal: () => void;
  isNotificationModalOpen: boolean;
}

const NotificationContext = createContext<INotificationContext>(
  {} as INotificationContext
);

const LottieAnimation = (animation) => {
  const lottieOptions = {
    loop: true,
    autoplay: true,
    isClickToPauseDisabled: true,
    animationData:
      animation.animation !== undefined ? animation.animation : processing,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <Box maxWidth="60%" mt="40px">
      <Lottie
        options={lottieOptions}
        width="auto"
        mt="55px"
        ariaRole="span"
        isClickToPauseDisabled={true}
        cursor="initial"
      />
    </Box>
  );
};

export const NotificationProvider = ({ children }) => {
  const [notificationData, setNotificationData] = useState<NotificationData>(
    {} as NotificationData
  );
  const { config } = useConfig();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { t } = useTranslation();
  const [query] = useLanguageQuery();

  const emitNotificationModal: EmitNotificationModal = ({
    message,
    type,
    image,
  }) => {
    if (isOpen === false) onOpen();
    setNotificationModalData({ message: message as Message, type: type as string, image });
  };

  const setNotificationModalData = ({
    message,
    type,
    image,
  }: {
    type: string;
    message: Message;
    image?: string;
  }) => {
    let data: NotificationData;
    switch (type) {
      case ERRORS.WALLETS.WRONG_NETWORK.TYPE:
      case ERRORS.METAMASK.INSTALLATION.TYPE:
        data = {
          lottieSrc: oops,
          heading: "Humm..",
          primaryText:
            message !== undefined && message.primaryText !== undefined
              ? message.primaryText
              : t("error"),
          secondaryText:
            message !== undefined && message.secondaryText !== undefined
              ? message.secondaryText
              : t("netwk_error"),
          canClose: true,
        };
        break;
      case PAYMENT_STEPS.IN_PROGRESS:
        data = {
          progressImg: process_succ,
          borderColor: config.mainColor,
          lottieSrc: processing,
          heading: t("process"),
          primaryText:
            message !== undefined && message.primaryText !== undefined
              ? message.primaryText
              : t("wait_modal"),
          secondaryText:
            message !== undefined && message.secondaryText !== undefined
              ? message.secondaryText
              : t("wait_descr"),
          canClose: false,
        };
        break;
      case PAYMENT_STEPS.SUCCESS:
        data = {
          borderColor: "#8AC576",
          progressImg: end_succ,
          nftImage: image,
          heading: "Yeah!",
          primaryText:
            message !== undefined && message.primaryText !== undefined
              ? message.primaryText
              : t("done_modal"),
          secondaryText:
            message !== undefined && message.secondaryText !== undefined
              ? message.secondaryText
              : t("done_descr"),
          canClose: true,
        };
        break;

      case PAYMENT_STEPS.SUCCESS_NO_EMAIL:
        data = {
          borderColor: "#8AC576",
          progressImg: end_succ,
          nftImage: image,
          heading: "Yeah!",
          primaryText:
            message !== undefined && message.primaryText !== undefined
              ? message.primaryText
              : t("done_modal"),
          secondaryText:
            message !== undefined && message.secondaryText !== undefined
              ? message.secondaryText
              : t("done_descr_no_email"),
          canClose: true,
        };
        break;

      case PAYMENT_STEPS.TIMEOUT:
        data = {
          borderColor: "#E30000",
          progressImg: process_fail,
          lottieSrc: oops,
          heading: "Humm...",
          primaryText:
            message !== undefined && message.primaryText !== undefined
              ? message.primaryText
              : t("timeout_modal"),
          secondaryText:
            message !== undefined && message.secondaryText !== undefined
              ? message.secondaryText
              : t("timeout_descr"),
          canClose: true,
        };
        break;
      case PAYMENT_STEPS.PROCESSING:
        data = {
          progressImg: transf_succ,
          borderColor: config.mainColor,
          lottieSrc: processing,
          heading: t("transfering"),
          primaryText:
            message !== undefined && message.primaryText !== undefined
              ? message.primaryText
              : t("transfering_modal"),
          secondaryText:
            message !== undefined && message.secondaryText !== undefined
              ? message.secondaryText
              : t("transfering_descr"),
          canClose: false,
        };
        break;
      default:
        data = {
          borderColor: "#E30000",
          lottieSrc: oops,
          heading: "Ops..",
          primaryText:
            message !== undefined && message.primaryText !== undefined
              ? message.primaryText
              : t("wait_tryagain"),
          secondaryText:
            message !== undefined && message.secondaryText !== undefined
              ? message.secondaryText
              : t("error_remain"),
          canClose: true,
        };
    }
    setNotificationData(data);
  };

  // // const [startTimer, setStartTimer] = useState<boolean>(false);
  // let startTimer = false;
  // let timer = null;


  // useEffect(() => {
  //   if (startTimer) {
  //     let timeout = setTimeout(() => {
  //       router.push("/userSpace");
  //     }, 9000);
  //     startTimer = false;
  //     timer = timeout;
  //     console.log("started timer", timeout);
  //     return () => clearTimeout(timeout);
  //   }
  // }, []);

  // function cancelSetTimerPush(timer) {
  //   console.log("canceled timer", timer);
  //   clearTimeout(timer);
  // }

  function handleCancelButton() {
    // console.log("canceling timer", timer);
    // cancelSetTimerPush(timer);
    onClose();
  }

  function handleGoNowButton() {
    // router.push("/userSpace");
    setTimeout(() => {
      onClose();
    }, 2000);

  }

  return (
    <NotificationContext.Provider
      value={{
        emitNotificationModal,
        onCloseModificationModal: onClose,
        isNotificationModalOpen: isOpen,
      }}
    >
      {children}
      <ChakraProvider resetCSS={false} theme={theme}>
        <Modal isCentered
          isOpen={isOpen}
          onClose={onClose}
          closeOnOverlayClick={notificationData.canClose}
        >
          <ModalOverlay />
          <ModalContent borderRadius="15px" maxWidth="507px" mx="20px">
            <ModalBody p="0px" m="0px">
              <Box
                p="50px"
                borderTop="6px solid"
                borderColor={
                  notificationData.borderColor === undefined
                    ? "#FDC921"
                    : notificationData.borderColor
                }
                borderRadius="15px"
              >
                <Flex
                  w="100%"
                  m="0 auto"
                  flexDir="column"
                  justifyContent="center"
                  alignItems="center"
                >
                  {/* ANIMAÇÃO ERRO OU PROGRESS OU PROCESSING */}
                  {notificationData.lottieSrc !== undefined && (
                    <>
                      {notificationData.progressImg !== undefined ? (
                        <Image
                          src={notificationData.progressImg}
                          w="100%"
                          borderRadius="15px"
                        />
                      ) : (
                        <Text
                          mb="15px"
                          fontSize="22px"
                          lineHeight="26px"
                          fontWeight="700"
                          textAlign="center"
                        >
                          {notificationData.heading}
                        </Text>
                      )}

                      <LottieAnimation animation={notificationData.lottieSrc} />
                      <Text
                        fontSize="18px"
                        mt="45px"
                        color="#A19D9D"
                        fontWeight="700"
                        textAlign="center"
                      >
                        {notificationData.primaryText}
                      </Text>
                      <Text
                        textAlign="center"
                        fontSize="18px"
                        lineHeight="21px"
                        color="#454545"
                        mt="27px"
                      >
                        {notificationData.secondaryText}
                      </Text>
                    </>
                  )}

                  {/* ANIMAÇÃO PADRÃO */}
                  {notificationData.lottieSrc === undefined &&
                    notificationData.nftImage === undefined && (
                      <>
                        <Text
                          mb="15px"
                          fontSize="22px"
                          lineHeight="26px"
                          fontWeight="700"
                          textAlign="center"
                        >
                          {notificationData.heading}
                        </Text>
                        <LottieAnimation animation={undefined} />
                        <Text
                          fontSize="18px"
                          mt="45px"
                          color="#A19D9D"
                          fontWeight="700"
                          textAlign="center"
                        >
                          {notificationData.primaryText}
                        </Text>
                        <Text
                          textAlign="center"
                          fontSize="18px"
                          lineHeight="21px"
                          color="#454545"
                          mt="27px"
                        >
                          {notificationData.secondaryText}
                        </Text>
                      </>
                    )}

                  {/* ANIMAÇÃO COMPRA COM SUCESSO */}
                  {notificationData.nftImage !== undefined && (
                    <>
                      {notificationData.progressImg !== undefined && (
                        <Image
                          src={notificationData.progressImg}
                          w="100%"
                          borderRadius="15px"
                        />
                      )}

                      <Flex
                        mt="55px"
                        alignItems="center"
                        justifyContent="center"
                        flexWrap={{ base: "wrap", sm: "nowrap" }}
                      >
                        <Image
                          src={notificationData.nftImage}
                          w="153px"
                          h="100%"
                          borderRadius="15px"
                        />
                        <Box ml={{ base: 0, sm: "35px" }}>
                          <Text
                            fontSize="18px"
                            mt="20px"
                            color="#454545"
                            fontWeight="700"
                            textAlign={{ base: "center", sm: "left" }}
                          >
                            {notificationData.primaryText}
                          </Text>
                          <Text
                            fontSize="18px"
                            lineHeight="21px"
                            color="#454545"
                            mt="20px"
                            fontWeight="400"
                            textAlign={{ base: "center", sm: "left" }}
                          >
                            {notificationData.secondaryText}
                          </Text>
                        </Box>
                      </Flex>
                      <Center mt="50px">
                        <Text
                          textAlign="center"
                          fontSize="18px"
                          fontWeight="400"
                          color="#717171"
                        >
                          {t("redirecting")}
                        </Text>
                      </Center>
                      <Center mt="20px" flexWrap={{ base: "wrap", sm: "nowrap" }}>
                        <Link href={{ pathname: "/userSpace", query: query }}>
                          <Button
                            minWidth="190px"
                            h="60px"
                            m="10px"
                            borderRadius="45px"
                            border="solid 1px #DFDFDF"
                            color="#454545"
                            fontSize="22px"
                            backgroundColor="white"
                            fontWeight="400"
                            _hover={{ backgroundColor: "white" }}
                            _active={{ backgroundColor: "white" }}
                            _focus={{ backgroundColor: "white", outline: "none" }}
                            onClick={() => handleGoNowButton()}
                          >
                            {t("go_now")}
                          </Button>
                        </Link>
                        <Button
                          minWidth="190px"
                          h="60px"
                          m="10px"
                          borderRadius="45px"
                          border="solid 1px #DFDFDF"
                          color="red"
                          fontSize="22px"
                          backgroundColor="white"
                          fontWeight="400"
                          _hover={{ backgroundColor: "white" }}
                          _active={{ backgroundColor: "white" }}
                          _focus={{ backgroundColor: "white", outline: "none" }}
                          onClick={() => handleCancelButton()}
                        >
                          {t("not_now")}
                        </Button>
                      </Center>
                    </>
                  )}
                </Flex>
              </Box>
              <Center mb="40px" flexWrap="wrap">
                <Text fontWeight={500} fontSize={"16px"} textAlign="center">
                  {t("processed_by")}
                </Text>
                <Image
                  src={wallpayLogo}
                  alt="Wallpay Logo"
                  mx="10px"
                  w="120px"
                />
              </Center>
            </ModalBody>
          </ModalContent>
        </Modal>
      </ChakraProvider>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      `useNotification must be used within a NotificationContext`
    );
  }
  return context;
};
