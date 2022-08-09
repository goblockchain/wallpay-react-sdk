import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Image,
  Box,
  Text,
  Flex,
  Checkbox,
  Center,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  useDisclosure,
  useClipboard,
  Input,
  Link,
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Progress,
  Show,
  Hide,
} from "@chakra-ui/react";

import BigNumber from "bignumber.js";
import { PaymentModalBody } from "./components";
import validator from "validator";
import wallpayLogo from "../../assets/wallpay.png";

import { PAYMENT_STEPS, NETWORKS, BlockchainInfo } from "../../enums";
import { useNotification } from "../../hooks/useNotification";
import { useStore } from "../../hooks/useStore";
import { useWallets } from "../../hooks/useWallets";
import { useConfig } from "../../hooks/useConfig";
import { useEthereum } from "../../hooks/useEthereum";

import eth from "../../assets/eth.png";
import polygon from "../../assets/polygon-wallet.png";
import Vector from "../../assets/Vector.png";
import pix from "../../assets/pix.png";
import pix_full from "../../assets/pix_full.png";
import axios from "axios";
import { useTranslation } from "next-export-i18n";
import { FormatPrice } from "../../utils";

export type PaymentData = {
  itemName: any;
  itemId: number;
  tokenId: number;
  fixedPrice: number; 
  PriceBRL: number;
  itemImage: string;
};

type PurchaseInfo = {
  amount: number;
  symbol: string;
  fiatAmount: number;
  currency: string;
  total?: number;
};

interface PaymentModalProps {
  onClose: () => void;
  paymentData: PaymentData;
  sdkPrivateKey: string;
}

const symbolImages = {
  ethereum: eth.src,
  polygon: polygon.src,
};

interface ButtonModalProps {
  color: string;
  text: string;
  action: () => void;
}

const ButtonModal = ({ color, text, action }: ButtonModalProps) => {
  const { config } = useConfig();
  return (
    <>
      <Button
        h="60px"
        bg="0"
        p="17px 48px"
        color={color}
        mr={3}
        onClick={action}
        fontWeight="400"
        fontSize="22px"
        _focus={{ outline: "none" }}
        _hover={{ bg: "0", border: `1px solid ${config.mainColor}` }}
        border="1px solid #DFDFDF"
        borderRadius="45px"
      >
        {text}
      </Button>
    </>
  );
};

interface PixCopyAndPasteProps {
  copyFn?: () => void;
}

const PixCopyAndPaste = ({ copyFn }: PixCopyAndPasteProps) => {
  const { t } = useTranslation();

  const [copyText, setCopyText] = useState(t("pix_copy_paste"));

  function handleCopyAndPasteClick() {
    setCopyText(t("pix_copy_paste_copied"));
    copyFn();
    console.log("Copiado");
    setTimeout(() => {
      setCopyText(t("pix_copy_paste"));
    }, 2000);
  }

  return (
    <>
      <Hide above="lg">
        <Tooltip
          hasArrow
          label={t("copy_clipboardMobile")}
          shouldWrapChildren
          bg="#454545"
          isOpen
        >
          <Center
            mt={{ base: "15px", md: "0px" }}
            flexDir="row"
            p="10px"
            border="1px solid #DFDFDF"
            borderRadius="10px"
            justifyContent="center"
            onClick={handleCopyAndPasteClick}
            cursor="pointer"
            h="60px"
            _hover={{ opacity: 0.9 }}
          >
            <Text ml="15px" fontWeight="400" fontSize="16px" color="#454545">
              {copyText}
            </Text>
          </Center>
        </Tooltip>
      </Hide>
      <Show above="lg">
        <Tooltip
          hasArrow
          label={t("copy_clipboard")}
          shouldWrapChildren
          bg="#454545"
        >
          <Center
            mt={{ base: "15px", md: "0px" }}
            flexDir="row"
            p="10px"
            border="1px solid #DFDFDF"
            borderRadius="10px"
            justifyContent="center"
            onClick={handleCopyAndPasteClick}
            cursor="pointer"
            h="60px"
            _hover={{ opacity: 0.9 }}
          >
            <Text ml="15px" fontWeight="400" fontSize="16px" color="#454545">
              {copyText}
            </Text>
          </Center>
        </Tooltip>
      </Show>
    </>
  );
};

let shouldCancelPixRequests = false;
export const PaymentModal = ({ onClose, paymentData, sdkPrivateKey }: PaymentModalProps) => {
  console.log('[[[[[[[[[[[[[[[[[[         sdkPrivateKey         ]]]]]]]]]]]]]]]]]]] ', sdkPrivateKey);
  const {
    onOpen: onSelectOpen,
    onClose: onSelectClose,
    onToggle: onSelectToggle,
    isOpen: isSelectOpen,
  } = useDisclosure();

  const {
    isOpen: isOpenPixNotification,
    onOpen,
    onClose: onClosePixNotification,
  } = useDisclosure();
  const getSymbolImage = () => {
    return symbolImages[config.blockchain];
  };
  // const router = useRouter();
  const { infuraW3instance } = useEthereum();
  const {
    web3,
    walletBalance,
    goBlockchainContract,
    walletAddress,
    setNewBalance,
    torusInstance,
    walletProvider,
    walletIsConnected,
  } = useWallets();
  const { emitNotificationModal } = useNotification();
  const { sellOffers, setSellOffers, updateUserNfts, setHasStoreNFTpurchased } =
    useStore();
  const { config } = useConfig();
  const [qrCodeImg, setQrCodeImg] = useState<string>("");
  const [paymentProvider, setPaymentProvider] = useState<string>("");
  console.log("paymentProvider" + paymentProvider);

  const [qrCodeTxt, setQrCodeTxt] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>(" ");
  const [dueDate, setDueDate] = useState<string>("");

  const [iPaying, setIPaying] = useState(false);

  // const [iuguId, setIuguId] = useState<string>("");
  let idPaymentProvider = "";

  const { hasCopied, onCopy } = useClipboard(qrCodeTxt);
  const { t } = useTranslation();

  const [step, setStep] = useState<
    | "paymentType"
    | "newCard"
    | "confirmPaymentCredit"
    | "cryptoCheckout"
    | "pix"
  >("paymentType");
  const [paymentType, setPaymentType] = useState<
    "Crypto" | "Pix" | "Selecionar"
  >("Selecionar");
  const [termsIsChecked, setTermsIsChecked] = useState(false);
  const [blockchainInfo] = useState(() => {
    let info: BlockchainInfo;
    if (config.networkType === "mainnet") {
      info = NETWORKS.MAINNET.find(
        (info) => info.BLOCKCHAIN === config.blockchain
      );
    } else {
      info = NETWORKS.TESTNET.find(
        (info) => info.BLOCKCHAIN === config.blockchain
      );
    }
    return info;
  });

  const calcDueDate = () => {
    let date = new Date();
    const minutes = 5;
    date.setTime(date.getTime() + minutes * 60 * 1000);
    setDueDate(date.toLocaleString());
  };

  const [pixDataId, setPixDataId] = useState<string>("");

  const handlePixPayment = async () => {
    try {
      setIPaying(true)
      let postData = {};
      if (userEmail !== "") {
        postData = {
          storeName: config.title.toLocaleLowerCase(),
          currency: blockchainInfo.SYMBOL,
          walletAddress: walletAddress,
          contractAddress: config.contractAddress,
          email: userEmail,
          clientName: userName,
          item: {
            amount: 1,
            price: paymentData.fixedPrice.toString(),
            description: `${config.title} - ${paymentData.itemName} NFT`,
            tokenId: paymentData.tokenId,
            fiat: config.currency,
          },
        };
      } else {
        postData = {
          storeName: config.title.toLocaleLowerCase(),
          currency: blockchainInfo.SYMBOL,
          walletAddress: walletAddress,
          contractAddress: config.contractAddress,
          clientName: userName,
          item: {
            amount: 1,
            price: paymentData.fixedPrice.toString(),
            description: `${config.title} - ${paymentData.itemName} NFT`,
            tokenId: paymentData.tokenId,
            fiat: config.currency,
          },
        };
      }
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/payment/pix`,
        postData,
        {
          headers: {
            "x-simple-access-token": process.env.NEXT_PUBLIC_API_AUTH_CODE,
          },
        }
      );
      // if (data.status === "qr_code_created") {
      setQrCodeImg(data.pix.qrcode);
      setPaymentProvider(data.paymentProvider);
      setQrCodeTxt(data.pix.qrcode_text);
      idPaymentProvider = data.idPaymentProvider;
      setPixDataId(data.paymentId);
      console.log("tudoData", data);
      setStep("pix");
      calcDueDate();
      updateUserNfts();
      // TODO: remover linha abaixo. Apenas para simulação
      setTimeout(async () => {
        // makePixPayment();
        waitPixPayment();
      }, 2000);
      // }
    } catch (error) {
      console.log(error);
    } finally {
      setIPaying(false)
    }
  };

  const handleClosePix = () => {
    cancelPayment(pixDataId);
    shouldCancelPixRequests = true;
    onClose();
  };

  useEffect(() => {
    console.log("step", step);
  }, [step]);

  let paymentStatus = "";

  const waitPixPayment = async () => {
    console.log("waitPixPayment");
    let tries = 0;
    let firstModal = false;
    let firstModalProcessing = false;
    try {
      const interval = setInterval(async () => {
        tries += 1;

        if (tries >= Math.ceil(TIME_TO_PAY / 2)) {
          console.log("TIMEOUT DO PAGAMENTO");
          onClose();
          emitNotificationModal({
            type: PAYMENT_STEPS.TIMEOUT,
          });
          return clearInterval(interval);
        }

        if (shouldCancelPixRequests) {
          return clearInterval(interval);
        }

        if (paymentStatus !== "succeeded") {
          const { data } = await getPixPaymentStatus();
          paymentStatus = data.status;
          console.log("STATUS: ", paymentStatus);
        }

        if (paymentStatus === "pending") {
          if (!firstModal) {
            onClose();
            emitNotificationModal({
              type: PAYMENT_STEPS.IN_PROGRESS,
            });
            firstModal = true;
            tries = 0;
          }
        }

        if (paymentStatus === "processing") {
          if (!firstModalProcessing) {
            onClose();
            emitNotificationModal({
              type: PAYMENT_STEPS.PROCESSING,
            });
            firstModalProcessing = true;
            tries = 0;
          }
        }

        if (paymentStatus === "succeeded") {
          console.log("CAIU O PAGAMENTO");
          onClose();
          emitNotificationModal({
            type: PAYMENT_STEPS.SUCCESS,
            image: paymentData.itemImage,
          });
          clearInterval(interval);
          const sellOffersWithNewlyPurchased = sellOffers;
          const newlyPurchasedIndex = sellOffersWithNewlyPurchased.findIndex(
            (offer) => offer.tokenId === paymentData.tokenId.toString()
          );
          sellOffersWithNewlyPurchased[newlyPurchasedIndex].purchased = true;
          setSellOffers(sellOffersWithNewlyPurchased);
          await setNewBalance({ web3, address: walletAddress });
          setHasStoreNFTpurchased(true);
          //await updateUserNfts();
        }
      }, 2000);
      return () => clearInterval(interval);
    } catch (error) {
      console.log("waitPix", error);
    }
  };

  const cancelPayment = async (paymentId) => {
    try {
      const notPaidData = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/payment/${paymentId}`,
        {
          status: "cancelled",
          auth: "Das4a-OPhjkFASkj",
        },
        {
          headers: {
            "x-simple-access-token": process.env.NEXT_PUBLIC_API_AUTH_CODE,
          },
        }
      );
      console.log("notPaidData", notPaidData);
    } catch (error) {
      console.log("cancelPayment", error);
    }
  };

  const makePixPayment = () => {
    console.log("makePixPayment com: ", idPaymentProvider);
    try {
      const pixResult = async () => {
        if (idPaymentProvider) {
          console.log("makePix iugu:", idPaymentProvider);
          const getData = async () => {
            const { data } = await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL}/webhooks/pix`,
              {
                authorization: process.env.NEXT_PUBLIC_API_AUTH_CODE,
                event: "invoice.status_changed",
                data: {
                  status: "paid",
                  id: idPaymentProvider,
                },
              }
            );
            console.log("PAGUEI data: ", data);
            emitNotificationModal({
              type: PAYMENT_STEPS.IN_PROGRESS,
            });
          };
          getData();
          await waitPixPayment();
        }
      };
      pixResult();
    } catch (error) {
      console.log("makePixPayment", error);
    }
  };

  const getPixPaymentStatus = async () => {
    return await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/transaction/${idPaymentProvider}`,
      {
        headers: {
          "x-simple-access-token": process.env.NEXT_PUBLIC_API_AUTH_CODE,
        },
      }
    );
  };

  let cryptoDataId = "";

  const handleCryptoPayment = async () => {
    try {
      onClose();
      emitNotificationModal({
        type: PAYMENT_STEPS.IN_PROGRESS,
      });
      let postData = {};
      if (userEmail !== "") {
        postData = {
          storeName: config.title.toLocaleLowerCase(),
          currency: blockchainInfo.SYMBOL,
          walletAddress: walletAddress,
          contractAddress: config.contractAddress,
          email: userEmail,
          clientName: userName,
          item: {
            amount: 1,
            price: paymentData.fixedPrice.toString(),
            description: `${config.title} - ${paymentData.itemName} NFT`,
            tokenId: paymentData.tokenId,
            fiat: config.currency,
          },
        };
      } else {
        postData = {
          storeName: config.title.toLocaleLowerCase(),
          currency: blockchainInfo.SYMBOL,
          walletAddress: walletAddress,
          contractAddress: config.contractAddress,
          item: {
            amount: 1,
            price: paymentData.fixedPrice.toString(),
            description: `${config.title} - ${paymentData.itemName} NFT`,
            tokenId: paymentData.tokenId,
            fiat: config.currency,
          },
        };
      }
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/payment/crypto`,
        postData,
        {
          headers: {
            "x-simple-access-token": process.env.NEXT_PUBLIC_API_AUTH_CODE,
          },
        }
      );

      console.log("cryptoData", data);
      cryptoDataId = data._id;

      const gasPrice = infuraW3instance.utils.toHex(
        await infuraW3instance.eth.getGasPrice()
      );
      const buyTokenObject = {
        from: walletAddress,
        value: web3.utils.toWei(etherPriceWithFee.toString(), "ether"), //paymentData.fixedPrice,
        gasPrice: gasPrice,
      };
      const gasLimit = await goBlockchainContract.methods
        .buyToken(paymentData.tokenId, 1)
        .estimateGas(buyTokenObject);
      const result = await goBlockchainContract.methods
        .buyToken(paymentData.tokenId, 1)
        .send({
          ...buyTokenObject,
          gas: infuraW3instance.utils.toHex(gasLimit),
        });

      emitNotificationModal({
        type: PAYMENT_STEPS.SUCCESS,
        image: paymentData.itemImage,
      });

      const paidData = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/payment/${data._id}`,
        {
          status: "paid",
          auth: "Das4a-OPhjkFASkj",
        },
        {
          headers: {
            "x-simple-access-token": process.env.NEXT_PUBLIC_API_AUTH_CODE,
          },
        }
      );

      const sellOffersWithNewlyPurchased = sellOffers;
      const newlyPurchasedIndex = sellOffersWithNewlyPurchased.findIndex(
        (offer) => offer.tokenId === paymentData.tokenId.toString()
      );
      sellOffersWithNewlyPurchased[newlyPurchasedIndex].purchased = true;
      setSellOffers(sellOffersWithNewlyPurchased);
      await setNewBalance({ web3, address: walletAddress });
      setHasStoreNFTpurchased(true);
      await updateUserNfts();
    } catch (error: any) {
      if (error.code === 4001) {
        console.log(error);
        emitNotificationModal({
          message: {
            primaryText: t("txt_fail"),
            secondaryText: t("txt_fail_desc"),
          },
        });
      } else {
        console.log(error);
        emitNotificationModal({
          message: {
            secondaryText: t("txt_not_concl"),
          },
        });
      }
      if (cryptoDataId !== "") {
        await cancelPayment(cryptoDataId);
      }
    }
  };

  const FEE = 0;

  const etherPriceWithFee = useMemo(() => {
    const priceToBN = new BigNumber(paymentData.fixedPrice);
    const feeToBN = new BigNumber(FEE);
    return priceToBN.plus(priceToBN.times(feeToBN)).toNumber();
  }, [paymentData.fixedPrice]);

  // conversor da taxa da go dapartil visual para o cliente
  const fiatPriceWithFee = useMemo(() => {
    const priceToBN = new BigNumber(paymentData.PriceBRL);
    const feeToBN = new BigNumber(0.1);
    return Number(
      priceToBN.plus(priceToBN.times(feeToBN)).toNumber().toFixed(2)
    );
  }, [paymentData.PriceBRL]);

  const choosePaymentType = () => {
    if (paymentType === "Crypto") {
      handleCryptoPayment();
    }
    if (paymentType === "Pix") {
      handlePixPayment();
    }
  };

  const handlePaymentSelect = (paymentType: "Crypto" | "Pix") => {
    setPaymentType(paymentType);
    onSelectClose();
  };

  const [showEmailInput, setShowEmailInput] = useState(true);

  const testShowEmailInput = async () => {
    if (walletProvider === "torus" && walletIsConnected) {
      const userInfo = await torusInstance.getUserInfo("");
      if (userInfo.email) {
        setUserEmail(userInfo.email);
        setUserName(userInfo.name);
        setShowEmailInput(false);
      } else {
        setShowEmailInput(true);
      }
    } else {
      setShowEmailInput(true);
    }
  };

  let tested = false;
  useEffect(() => {
    if (step === "paymentType" && !tested) {
      console.log("paymentData", paymentData);
      testShowEmailInput();
      tested = true;
    }
  }, [step]);

  const TIME_TO_PAY = 300;
  const [timerProgress, setTimerProgress] = useState(100);
  const [countDown, setCountDown] = useState(TIME_TO_PAY);

  useEffect(() => {
    if (
      countDown > 0 &&
      step === "pix" &&
      (paymentStatus === undefined || paymentStatus === "")
    ) {
      const interval = setInterval(() => {
        setCountDown(countDown - 1);
        setTimerProgress((countDown / TIME_TO_PAY) * 100);
      }, 1000);
      return () => clearInterval(interval);
    }
    if (countDown === 0 && step === "pix") {
      onClose();
      emitNotificationModal({
        type: PAYMENT_STEPS.TIMEOUT,
      });
    }
    console.log(paymentStatus);
  }, [countDown, step]);

  function toTime(seconds) {
    var date = new Date(null);
    date.setSeconds(seconds);
    return date.toISOString().substr(14, 5);
  }

  return (
    <>
      {step === "paymentType" && (
        <PaymentModalBody onClosePaymentModal={onClose}>
          <Box w="100%" m="0 auto">
            <Text
              fontWeight="700"
              fontSize="16px"
              color="#454545"
              textAlign="left"
              mt="30px"
            >
              {t("payment_type")}
            </Text>
            <Center
              flexDir="row"
              p="10px"
              mt="7px"
              border="1px solid #DFDFDF"
              borderRadius="10px"
              justifyContent="space-between"
              onClick={onSelectToggle}
              cursor="pointer"
              h="60px"
            >
              {paymentType == "Pix" && (
                <>
                  <Center ml="15px" flexDir="row" justifyContent="start">
                    <Image src={pix.src} mr="17px" h="16px" />
                    <Text
                      fontSize="14px"
                      fontWeight="400px"
                      fontFamily="Roboto"
                      color="#454545"
                    >
                      BRL - Pix
                    </Text>
                  </Center>
                </>
              )}
              {paymentType == "Crypto" && (
                <>
                  <Center ml="15px" flexDir="row" justifyContent="start">
                    <Image src={getSymbolImage()} mr="17px" h="23px" />
                    <Text
                      fontSize="14px"
                      fontWeight="400px"
                      fontFamily="Roboto"
                      color="#454545"
                    >
                      {blockchainInfo.SYMBOL}
                    </Text>
                  </Center>
                </>
              )}
              {paymentType == "Selecionar" && (
                <>
                  <Text
                    ml="15px"
                    fontWeight="400"
                    fontSize="16px"
                    color="#A19D9D"
                  >
                    {" "}
                    {t("select")}
                  </Text>
                </>
              )}
              <Popover
                placement="bottom-end"
                onClose={onSelectClose}
                onOpen={onSelectOpen}
                isOpen={isSelectOpen}
              >
                <PopoverTrigger>
                  <Button
                    bg="0"
                    p="0px"
                    _hover={{ bg: "0" }}
                    _focus={{ outline: "none" }}
                  >
                    <Image src={Vector.src} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  boxShadow="0px 6px 23px rgba(0, 0, 0, 0.15)"
                  _focus={{ outline: "none" }}
                  border="none"
                  p="0px"
                  w={{ base: "272px", md: "405px" }}
                  mr="-10px"
                  mt="20px"
                >
                  <PopoverBody
                    p="20px"
                    onClick={() => handlePaymentSelect("Pix")}
                  >
                    <Center
                      flexDir="row"
                      justifyContent="start"
                      cursor="pointer"
                    >
                      <Image src={pix.src} mr="17px" />
                      <Text
                        fontSize="14px"
                        fontWeight="400px"
                        fontFamily="Roboto"
                        color="#454545"
                      >
                        BRL - Pix
                      </Text>
                    </Center>
                  </PopoverBody>
                  <PopoverBody
                    p="20px"
                    onClick={() => handlePaymentSelect("Crypto")}
                  >
                    <Center
                      flexDir="row"
                      justifyContent="start"
                      cursor="pointer"
                    >
                      <Image src={getSymbolImage()} mr="17px" h="23px" />
                      <Text
                        fontSize="14px"
                        fontWeight="400px"
                        fontFamily="Roboto"
                        color="#454545"
                      >
                        {blockchainInfo.SYMBOL}
                      </Text>
                    </Center>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </Center>
            {paymentType === "Crypto" && showEmailInput && (
              <>
                <Flex w="100%" justifyContent="flex-end">
                  <Input
                    w="100%"
                    mt="10px"
                    h="60px"
                    border="1px solid #DFDFDF"
                    borderRadius="10px"
                    placeholder={t("type_email_optional")}
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                  />
                </Flex>
                <Flex w="100%" justifyContent="flex-end">
                  <Text fontSize="16px" mt="5px" mr="2px">
                    {t("saldo2")}:{" "}
                    <FormatPrice
                      amount={walletBalance}
                      currency={blockchainInfo.SYMBOL}
                    />
                  </Text>
                </Flex>
              </>
            )}
            {paymentType === "Crypto" && !showEmailInput && (
              <Flex w="100%" justifyContent="flex-end">
                <Text fontSize="16px" mt="5px" mr="2px">
                  {t("saldo2")}:{" "}
                  <FormatPrice
                    amount={walletBalance}
                    currency={blockchainInfo.SYMBOL}
                  />
                </Text>
              </Flex>
            )}

            {paymentType === "Pix" && showEmailInput && (
              <>
                <Flex w="100%" justifyContent="flex-end">
                  <Input
                    w="100%"
                    mt="10px"
                    h="60px"
                    border="1px solid #DFDFDF"
                    borderRadius="10px"
                    placeholder={t("type_email_required")}
                    required
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                  />
                </Flex>
              </>
            )}
            <Box mt="63px" />
            {FEE > 0 && (
              <>
                <Flex w="100%" justifyContent="space-between" mt="63px">
                  <Text
                    fontSize="16px"
                    fontWeight="700"
                    lineHeight="19px"
                    fontFamily="Roboto"
                    fontStyle="normal"
                    color="#454545"
                  >
                    {" "}
                    {t("Valor")}
                  </Text>
                  <Text
                    fontSize="16px"
                    fontWeight="700"
                    lineHeight="19px"
                    fontFamily="Roboto"
                    fontStyle="normal"
                    color="#454545"
                  >
                    {paymentType !== "Pix" && (
                      <FormatPrice
                        amount={paymentData.fixedPrice}
                        currency={blockchainInfo.SYMBOL}
                      />
                    )}
                    {paymentType == "Pix" && (
                      <FormatPrice
                        amount={paymentData.PriceBRL}
                        currency={config.currency}
                      />
                    )}
                  </Text>
                </Flex>

                <Flex w="100%" justifyContent="space-between" mt="11px">
                  <Text
                    fontSize="16px"
                    fontWeight="700"
                    lineHeight="19px"
                    fontFamily="Roboto"
                    fontStyle="normal"
                    color="#454545"
                  >
                    {" "}
                    {t("taxa")}
                  </Text>
                  <Text
                    fontSize="16px"
                    fontWeight="700"
                    lineHeight="19px"
                    fontFamily="Roboto"
                    fontStyle="normal"
                    color="#A19D9D"
                  >
                    {blockchainInfo.SYMBOL}
                  </Text>
                </Flex>
                <Text
                  mt="9px"
                  textAlign="end"
                  fontSize="16px"
                  fontWeight="700"
                  lineHeight="19px"
                  fontFamily="Roboto"
                  fontStyle="normal"
                  color="#009FE3"
                >
                  {t("see_tax")}
                </Text>
              </>
            )}
            <Box mt="28px" w="100%" height="1px" background="#DFDFDF" />
            <Flex mt="25px" w="100%" justifyContent="space-between">
              <Text
                fontSize="18px"
                fontWeight="700"
                lineHeight="21px"
                fontFamily="Roboto"
                color="#454545"
              >
                {t("total_value")}
              </Text>
              <Text
                fontSize="20px"
                fontWeight="700"
                lineHeight="23px"
                fontFamily="Roboto"
                fontStyle="normal"
                color="#454545"
              >
                {paymentType !== "Pix" && (
                  <FormatPrice
                    amount={etherPriceWithFee}
                    currency={blockchainInfo.SYMBOL}
                  />
                )}
                {paymentType == "Pix" && (
                  <FormatPrice
                    amount={paymentData.PriceBRL}
                    currency={config.currency}
                  />
                )}
              </Text>
            </Flex>
            <Flex mt="48px" w="100%">
              <Checkbox
                checked={false}
                onChange={() => setTermsIsChecked(!termsIsChecked)}
                alignItems="center"
              >
                <Box ml="10px">
                  <Text
                    fontWeight="400"
                    fontFamily="Roboto"
                    fontSize="16px"
                    color="#9E9E9E"
                    flexWrap="wrap"
                    textAlign="left"
                  >
                    {t("check_")} {""}
                    <Link
                      fontWeight="700"
                      fontSize="16px"
                      color="#454545"
                      cursor="pointer"
                      href="https://drive.google.com/file/d/1D8bSTcXUmKjAj7AgUJWIPccmE6XItKt2/view?usp=sharing"
                      target="_blank"
                    >
                      {t("terms_of_service")}
                    </Link>
                    .
                  </Text>
                </Box>
              </Checkbox>
            </Flex>
            <Box mt="17px">
              <Button
                disabled={!termsIsChecked || paymentType == "Selecionar" || (paymentType === "Pix" && !validator.isEmail(userEmail)) || iPaying == true}
                onClick={choosePaymentType}
                borderRadius="48px"
                border="1px solid #dfdfdf"
                bg="#454545"
                _hover={{ bg: "black" }}
                _active={{ bg: "black" }}
                _focus={{ bg: "black" }}
                m="0 auto"
                height="60px"
                textAlign="center"
                width="100%"
                color="#FFFFFF"
                fontWeight="400"
                fontSize="22px"
                isLoading={iPaying}
              >
                {t("continue")}
              </Button>
            </Box>
            <Center mt="40px" flexWrap="wrap">
              <Text fontWeight={500} fontSize={"16px"} textAlign="center">
                {t("processed_by")}
              </Text>
              <Image
                src={wallpayLogo.src}
                alt="Wallpay Logo"
                mx="10px"
                w="120px"
              />
            </Center>
          </Box>
        </PaymentModalBody>
      )}
      {step === "cryptoCheckout" && (
        <Box
          borderTop="6px solid"
          borderColor={config.mainColor}
          borderRadius="15px"
          p="50px"
        >
          <Text>Cripto</Text>
        </Box>
      )}
      {step === "pix" && (
        <PaymentModalBody
          title={t("pix_payment_title")}
          onClosePaymentModal={onOpen}
        >
          <Box w="100%" m="0 auto">
            <Image src={pix_full.src} w="50%" m="30px auto" />
            <Text
              display={{ base: "none", md: "block" }}
              color="#A19D9D"
              fontSize="18px"
              fontWeight="700"
              lineHeight="21px"
              maxW="89%"
              m="0 auto"
              textAlign="center"
            >
              {t("qr_code")}
            </Text>

            {paymentProvider == "MERCADOPAGO" && (
              <Image
                display={{ base: "none", md: "block" }}
                src={`data:image/jpeg;base64,${qrCodeImg}`}
                w="65%"
                m="30px auto"
              />
            )}
            {paymentProvider == "IUGU" && (
              <Image
                display={{ base: "none", md: "block" }}
                src={qrCodeImg}
                w="65%"
                m="30px auto"
              />
            )}
            <Box
              mt="10px"
              fontSize="18px"
              fontWeight="700"
              lineHeight="21px"
              textAlign="left"
              // maxW="89%"
              display={{ base: "block", md: "none" }}
            >
              <Text>{t("copy_pix")}</Text>
              <Text mt="8px">{t("acess_banco")}</Text>
              <Text mt="8px">{t("pagar_pix")}</Text>
              <Text mt="8px">{t("copie_cole")}</Text>
            </Box>
            <PixCopyAndPaste copyFn={onCopy} />
            <Text
              mt={{ base: "90px", xl: "34px" }}
              textAlign="center"
              fontWeight="700"
              fontSize="18px"
              lineHeight="21px"
              color="#454545"
            >
              {t("pay_until")}: {toTime(countDown)}
            </Text>
            <Progress
              mt="10px"
              height="8px"
              hasStripe
              value={Number(timerProgress)}
              borderRadius="47px"
              color="#009FE3"
            />
            <Flex
              w="100%"
              justifyContent="space-between"
              pt="10px"
              mt={{ base: "30px", xl: "60px" }}
              borderTop={`1px solid #DFDFDF`}
            >
              <Text
                fontSize="18px"
                fontWeight="700"
                lineHeight="21px"
                fontFamily="Roboto"
                color="#454545"
              >
                {t("total_value")}
              </Text>
              <Text
                fontSize="18px"
                fontWeight="700"
                lineHeight="21px"
                fontFamily="Roboto"
                fontStyle="normal"
                color="#454545"
              >
                <FormatPrice
                  amount={paymentData.PriceBRL}
                  currency={config.currency}
                />
              </Text>
            </Flex>
          </Box>
          <Center mt="40px" flexWrap="wrap">
            <Text fontWeight={500} fontSize={"16px"} textAlign="center">
              {t("processed_by")}
            </Text>
            <Image
              src={wallpayLogo.src}
              alt="Wallpay Logo"
              mx="10px"
              w="120px"
            />
          </Center>
        </PaymentModalBody>
      )}
      <Modal isOpen={isOpenPixNotification} onClose={onClosePixNotification}>
        <ModalOverlay />
        <ModalContent
          p="50px"
          borderRadius="15px"
          boxShadow="0px 6px 23px rgba(0, 0, 0, 0.15)"
        >
          <ModalHeader fontWeight="700" fontSize="22px" textAlign="center">
            {t("Warning")}
          </ModalHeader>
          <ModalBody p="0px">
            <Text
              mt="28px"
              fontWeight="400"
              fontSize="18px"
              textAlign="center"
              lineHeight="21px"
            >
              {t("pix_attention")}
            </Text>
          </ModalBody>
          <ModalFooter p="0px" mt="48px" justifyContent="space-between">
            <ButtonModal
              color="#EB5757"
              text={t("continue")}
              action={handleClosePix}
            />
            <ButtonModal
              color="#454545"
              text={t("Cancel")}
              action={onClosePixNotification}
            />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
