import React, { Fragment, useEffect, useMemo, useState } from "react";

import {
  Box,
  Button,
  Container,
  Dialog,
  FormControlLabel,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  Slide,
  Snackbar,
  SwipeableDrawer,
  TextField,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";

import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import CloseIcon from "@material-ui/icons/Close";
import FavoriteIcon from "@material-ui/icons/Favorite";
import StarIcon from "@material-ui/icons/Star";

import { Alert } from "@material-ui/lab";
import { StaticDateRangePicker } from '@mui/x-date-pickers-pro'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { vi } from "date-fns/locale";

import moment from "moment";
import queryString from "query-string";

import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router";

import BookingPrice from "../../components/BookingPrice";
import ButtonSubmit from "../../components/ButtonSubmit";
import GuestCount from "../../components/GuestCount";

import {
  DetailRoomAction,
  PayBookingAction,
} from "../../store/action/RentRoomsAction";
import { formMoney } from "../../utilities/helper";

import ResultTicket from "./ResultTicket";
import useStyles from "./style";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Pay = () => {
  const location = useLocation();
  const history = useHistory();
  const theme = useTheme();
  const dispatch = useDispatch();
  const param = useParams();

  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const { detailRoom } = useSelector((state) => state.RentRoomsReducer);

  const queryParams = useMemo(() => {
    const params = queryString.parse(location.search);
    return {
      ...params,
    };
  }, [location.search]);

  const [valueGroup, setValueGroup] = useState("Visa");
  const [open, setOpen] = useState({
    modalDate: false,
    modalPay: false,
    modalGuest: false,
  });
  const [numbersFilter, setNumbersFilter] = useState({
    _adult: Number(queryParams._adult) || 1,
    _children: Number(queryParams._children),
    _toddler: Number(queryParams._toddler),
  });

  const [bookingTime, setBookingTime] = useState([
    queryParams._checkIn ? new Date(queryParams._checkIn) : null,
    queryParams._checkOut ? new Date(queryParams._checkOut) : null,
  ]);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const totalDateTime = bookingTime[1] - bookingTime[0];
  const totalDate = totalDateTime / (1000 * 3600 * 24);
  const isBooking = bookingTime.some((item) => item === null);

  const date = new Date()?.setDate(bookingTime[0]?.getDate() - 4);
  const daysAgo = new Date(date);

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(DetailRoomAction(param.roomId));
  }, [dispatch, param.roomId]);
  const totalPrice = () => {
    return totalDate < 7
      ? formMoney(detailRoom?.price * totalDate + 100000)
      : totalDate > 30
      ? formMoney(detailRoom?.price * (totalDate - 5) + 100000)
      : formMoney(detailRoom?.price * (totalDate - 1) + 100000);
  };

  const data = {
    roomId: param.roomId,
    checkIn: bookingTime[0],
    checkOut: bookingTime[1],
  };

  const textPayButton = "X??c nh???n v?? thanh to??n";
  const textPayModal = "Quay v??? trang ch???";
  const days = ["C", "2", "3", "4", "5", "6", "7"];
  const months = [
    "Th??ng 1",
    "Th??ng 2",
    "Th??ng 3",
    "Th??ng 4",
    "Th??ng 5",
    "Th??ng 6",
    "Th??ng 7",
    "Th??ng 8",
    "Th??ng 9",
    "Th??ng 10",
    "Th??ng 11",
    "Th??ng 12",
  ];

  const locale = {
    ...vi,
    localize: {
      day: (n) => days[n],
      month: (n) => months[n],
    },
  };
  const handleChangeRadioGroup = (event) => {
    setValueGroup(event.target.value);
  };
  const handleOpen = () => {
    setOpen({ ...open, modalDate: true });
  };
  const handleOpen1 = () => {
    if (
      bookingTime[0].toString() !== "Invalid Date" &&
      bookingTime[1].toString() !== "Invalid Date"
    ) {
      setOpen({ ...open, modalPay: true });
      dispatch(PayBookingAction(data));
    } else {
      setOpenSnackbar(true);
    }
  };
  const handleOpen2 = () => {
    setOpen({ ...open, modalGuest: true });
  };
  const handleClose = () => {
    setOpen({ ...open, modalDate: false, modalPay: false, modalGuest: false });
  };
  const handleClickBackHome = () => {
    history.push("/");
  };
  const toggleDrawer = (anchor, opened) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setOpen({ ...open, [anchor]: opened });
  };

  const handleAlert = () => {
    setOpenSnackbar(true);
  };
  const handleCloseSnackbar = () => {
    if (isBooking) {
      setOpenSnackbar(false);
    }

    setOpenSnackbar(false);
  };

  const classes = useStyles({ isDesktop });
  return (
    <div>
      <Container className={classes.pay} maxWidth={false}>
        <Box>
          <div className={classes.pay__title}>
            <IconButton
              className={classes.pay__title__iconBtn}
              onClick={() => history.goBack()}
            >
              <ArrowBackIosIcon className={classes.pay__title__icon} />
            </IconButton>
            <Typography
              className={classes.pay__title__text}
              variant="subtitle1"
            >
              X??c nh???n v?? thanh to??n
            </Typography>
          </div>
          <div className={classes.pay__content}>
            <Grid container>
              {/* MOBILE RIGHT  */}
              <Grid className={classes.pay_mobile} item lg={6} md={6} xs={12}>
                <Box className={classes.pay__right}>
                  <div>
                    <div>
                      <Box>
                        <Box display="flex">
                          <Box flex="0 0 35%">
                            <img
                              src={detailRoom.image}
                              alt="img"
                              className={classes.pay__right__img}
                            />
                          </Box>
                          <div className={classes.pay__right__style}>
                            <Typography
                              className={classes.pay__right__text__caption}
                              variant="caption"
                            >
                              To??n b??? c??n h??? cho thu?? t???i{" "}
                              {detailRoom?.locationId?.name}
                            </Typography>
                            <div>
                              <Typography
                                variant="body1"
                                className={classes.pay__right__text}
                              >
                                {detailRoom.name}
                              </Typography>
                              <Typography variant="caption">
                                {detailRoom.guests} kh??ch
                              </Typography>
                              <Typography variant="caption">
                                ?? {detailRoom.bath} ph??ng t???m
                              </Typography>{" "}
                              <Typography variant="caption">
                                ?? {detailRoom.bedRoom} ph??ng ng???
                              </Typography>
                            </div>
                            <Box display="flex" flexWrap="wrap">
                              <Box paddingRight={3}>
                                <div className={classes.pay__right__item}>
                                  <StarIcon
                                    className={classes.pay__right__item__icon}
                                  />
                                  <span>
                                    {detailRoom?.locationId?.valueate}
                                  </span>
                                </div>
                              </Box>
                              <div>
                                <div className={classes.pay__right__item}>
                                  <FavoriteIcon
                                    className={classes.pay__right__item__icon}
                                  />
                                  <span>Ch??? nh?? si??u c???p</span>
                                </div>
                              </div>
                            </Box>
                          </div>
                        </Box>
                      </Box>
                    </div>
                  </div>
                </Box>
              </Grid>

              {/* LEFT DESKTOP  */}
              <Grid item lg={6} md={6} style={{ marginBottom: 100 }}>
                {/* NOTI */}

                {/* CHUY???N ??I C???A B???N  */}
                <div className={classes.pay__item}>
                  <Typography className={classes.pay__item__title}>
                    Chuy???n ??i c???a b???n
                  </Typography>
                </div>
                <div className={classes.pay__item}>
                  <div className={classes.pay__item__style}>
                    <div>
                      <Typography
                        className={classes.pay__text__style}
                        variant="subtitle2"
                      >
                        Ng??y
                      </Typography>
                      {isBooking ? (
                        "Ch???n ng??y"
                      ) : (
                        <Typography variant="span">
                          {moment(bookingTime[0]).format("Do MMM  YYYY")} -
                          <Typography variant="span">
                            {moment(bookingTime[1]).format("Do MMM  YYYY")}
                          </Typography>
                        </Typography>
                      )}
                    </div>
                    <div>
                      <Typography
                        onClick={handleOpen}
                        className={classes.pay__button__style}
                      >
                        Ch???nh s???a
                      </Typography>
                    </div>
                  </div>
                </div>
                <div className={classes.pay__item}>
                  <div className={classes.pay__item__style}>
                    <div>
                      <Typography
                        className={classes.pay__text__style}
                        variant="subtitle2"
                      >
                        Kh??ch
                      </Typography>
                      <Typography>
                        {" "}
                        {numbersFilter._adult + numbersFilter._children} kh??ch
                        {numbersFilter._toddler !== 0
                          ? `, ${numbersFilter._toddler} em b??`
                          : null}
                      </Typography>
                    </div>
                    <div>
                      <Typography
                        onClick={handleOpen2}
                        className={classes.pay__button__style}
                      >
                        Ch???nh s???a
                      </Typography>
                    </div>
                  </div>
                </div>

                {/* THANH TO??N B???NG  */}
                <div className={classes.pay__left__payment}>
                  <div>
                    <Typography className={classes.pay__item__title}>
                      Thanh to??n b???ng
                    </Typography>
                  </div>
                  <div>
                    <ul className={classes.pay__left__list}>
                      <li>
                        <img
                          src="https://a0.muscache.com/airbnb/static/packages/assets/frontend/legacy-shared/svgs/payments/logo_visa.0adea522bb26bd90821a8fade4911913.svg"
                          alt=""
                        />
                      </li>
                      <li>
                        <img
                          src="https://a0.muscache.com/airbnb/static/packages/assets/frontend/legacy-shared/svgs/payments/logo_mastercard.f18379cf1f27d22abd9e9cf44085d149.svg"
                          alt=""
                        />
                      </li>
                      <li>
                        <img
                          src="https://a0.muscache.com/airbnb/static/packages/assets/frontend/legacy-shared/svgs/payments/logo_googlepay.3f786bc031b59575d24f504dfb859da0.svg"
                          alt=""
                        />
                      </li>
                      <li>
                        <img
                          src="https://a0.muscache.com/airbnb/static/packages/assets/frontend/legacy-shared/svgs/payments/logo_paypal.faa3042fa2daf6b4a9822cc4b43e8609.svg"
                          alt=""
                        />
                      </li>
                    </ul>
                  </div>
                </div>
                <div>
                  <RadioGroup
                    aria-label="gender"
                    name="gender1"
                    value={valueGroup}
                    onChange={handleChangeRadioGroup}
                  >
                    <FormControlLabel
                      value="Visa"
                      control={<Radio />}
                      label="Visa"
                    />
                    <FormControlLabel
                      value="MasterCard"
                      control={<Radio />}
                      label="Master Card"
                    />
                    <FormControlLabel
                      value="GooglePay"
                      control={<Radio />}
                      label="Google Pay"
                    />
                    <FormControlLabel
                      value="Paypal"
                      control={<Radio />}
                      label="Paypal"
                    />
                  </RadioGroup>
                </div>

                {/* B???T BU???C CHUY???N ??I C???A B???N  */}
                <div>
                  <div className={classes.pay__item__style__title}>
                    <Typography className={classes.pay__item__title}>
                      B???t bu???c cho chuy???n ??i c???a b???n
                    </Typography>
                  </div>
                  <div style={{ paddingBottom: 24 }}>
                    <div className={classes.pay__item__style}>
                      <Typography
                        className={classes.pay__text__style}
                        variant="subtitle2"
                      >
                        ???nh ?????i di???n
                      </Typography>
                    </div>
                    <Typography className={classes.pay__radio__style}>
                      Ch??? nh?? mu???n bi???t ng?????i s??? ??? nh?? h??? l?? ai.
                    </Typography>
                  </div>
                  <div style={{ paddingBottom: 24 }}>
                    <div className={classes.pay__item__style}>
                      <Typography
                        className={classes.pay__text__style}
                        variant="subtitle2"
                      >
                        S??? ??i???n tho???i
                      </Typography>
                    </div>
                    <Typography className={classes.pay__radio__style}>
                      Th??m v?? x??c nh???n s??? ??i???n tho???i c???a b???n ????? nh???n th??ng tin
                      c???p nh???t v??? chuy???n ??i.
                    </Typography>
                  </div>
                </div>

                {/* CH??NH S??CH H???Y  */}
                <div>
                  <div className={classes.pay__item__style__title}>
                    <Typography className={classes.pay__item__title}>
                      Ch??nh s??ch h???y
                    </Typography>
                  </div>
                  <div style={{ paddingBottom: 24 }}>
                    <span className={classes.pay__item__content__text}>
                      H???y mi???n ph?? tr?????c 14:00, ng??y{" "}
                      {moment(daysAgo).format("Do MMM YYYY")}.
                    </span>
                    <span>
                      {" "}
                      Sau ????, h??y h???y tr?????c 14:00 ng??y{" "}
                      {moment(bookingTime[0]).format("Do MMM YYYY")}. ????? ???????c
                      ho??n l???i 50%, tr??? chi ph?? ????m ?????u ti??n v?? ph?? d???ch v???.
                    </span>
                    <div>
                      <a
                        href="https://www.airbnb.com.vn/help/article/149/t%C3%ACm-ch%C3%ADnh-s%C3%A1ch-h%E1%BB%A7y-%C3%A1p-d%E1%BB%A5ng-cho-%C4%91%E1%BA%B7t-ph%C3%B2ng-c%E1%BB%A7a-b%E1%BA%A1n"
                        className={classes.pay__button__style}
                      >
                        T??m hi???u th??m
                      </a>
                    </div>
                  </div>
                  <div style={{ paddingBottom: 24 }}>
                    <span>
                      Ch??nh s??ch tr?????ng h???p b???t kh??? kh??ng c???a ch??ng t??i kh??ng ??p
                      d???ng cho c??c tr?????ng h???p gi??n ??o???n ??i l???i do COVID-19 g??y
                      ra.{" "}
                    </span>
                    <div>
                      <a
                        href="https://www.airbnb.com.vn/help/article/2701/ch%C3%ADnh-s%C3%A1ch-tr%C6%B0%E1%BB%9Dng-h%E1%BB%A3p-b%E1%BA%A5t-kh%E1%BA%A3-kh%C3%A1ng-v%C3%A0-%C4%91%E1%BA%A1i-d%E1%BB%8Bch-vir%C3%BAt-corona-covid19"
                        className={classes.pay__button__style}
                      >
                        T??m hi???u th??m
                      </a>
                    </div>
                  </div>
                </div>

                {/* X??C NH???N V?? THANH TO??N  */}
                <div className={classes.pay__item__style__title}>
                  <span>B???ng vi???c ch???n n??t b??n d?????i, t??i ?????ng ?? v???i</span>
                  <span>
                    {" "}
                    N???i quy nh?? c???a Ch??? nh??, C??c y??u c???u v??? an to??n trong ?????i
                    d???ch COVID-19 c???a Airbnb v?? Ch??nh s??ch ho??n ti???n cho kh??ch.
                  </span>
                </div>
                <div>
                  <ButtonSubmit
                    handleSubmit={handleOpen1}
                    text={textPayButton}
                  />
                </div>
              </Grid>

              {/* RIGHT  */}
              <Grid className={classes.pay_desktop} item lg={6} md={6} xs={12}>
                <Box className={classes.pay__right}>
                  <div>
                    <div className={classes.pay__left__noti}>
                      <Box paddingBottom={3}>
                        <Box display="flex">
                          <Box flex="0 0 35%">
                            <img
                              src={detailRoom.image}
                              alt="img"
                              className={classes.pay__right__img}
                            />
                          </Box>
                          <div className={classes.pay__right__style}>
                            <Typography
                              className={classes.pay__right__text__caption}
                              variant="caption"
                            >
                              To??n b??? c??n h??? cho thu?? t???i{" "}
                              {detailRoom?.locationId?.name}
                            </Typography>
                            <div>
                              <Typography
                                variant="body1"
                                className={classes.pay__right__text}
                              >
                                {detailRoom.name}
                              </Typography>
                              <Typography variant="caption">
                                {detailRoom.guests} kh??ch
                              </Typography>
                              <Typography variant="caption">
                                ?? {detailRoom.bath} ph??ng t???m
                              </Typography>{" "}
                              <Typography variant="caption">
                                ?? {detailRoom.bedRoom} ph??ng ng???
                              </Typography>
                            </div>
                            <Box display="flex" flexWrap="wrap">
                              <Box paddingRight={3}>
                                <div className={classes.pay__right__item}>
                                  <StarIcon
                                    className={classes.pay__right__item__icon}
                                  />
                                  <span>
                                    {detailRoom?.locationId?.valueate}
                                  </span>
                                </div>
                              </Box>
                              <div>
                                <div className={classes.pay__right__item}>
                                  <FavoriteIcon
                                    className={classes.pay__right__item__icon}
                                  />
                                  <span>Ch??? nh?? si??u c???p</span>
                                </div>
                              </div>
                            </Box>
                          </div>
                        </Box>
                      </Box>
                      <div className={classes.pay__item__style__title}>
                        <Typography className={classes.pay__item__title}>
                          Chi ti???t gi??
                        </Typography>
                      </div>
                      {isBooking ? null : (
                        <BookingPrice
                          totalDate={totalDate}
                          detailRoom={detailRoom}
                        />
                      )}
                    </div>
                  </div>
                </Box>
              </Grid>
            </Grid>
          </div>
        </Box>

        <Dialog
          onClose={isBooking ? handleAlert : handleClose}
          open={open.modalDate || open.modalPay || open.modalGuest}
          maxWidth="md"
          className={classes.root}
          keepMounted
          TransitionComponent={Transition}
        >
          {open.modalPay && (
            <div>
              <div className={`${classes.modal__header} ${classes.modal__pay}`}>
                <IconButton className={classes.iconModal} onClick={handleClose}>
                  <CloseIcon />
                </IconButton>
                <Typography variant="body2">?????t v?? th??nh c??ng</Typography>
                <div></div>
              </div>
              {/* <ResultTicket /> */}
              <div className={classes.ButtonResult}>
                <ResultTicket
                  valueGroup={valueGroup}
                  totalDate={totalDate}
                  detailRoom={detailRoom}
                  totalPrice={totalPrice}
                />
                <ButtonSubmit
                  handleSubmit={handleClickBackHome}
                  text={textPayModal}
                />
              </div>
            </div>
          )}
          {open.modalDate && (
            <div className={classes.date_modal}>
              <div className={classes.modal__header}>
                <IconButton
                  className={classes.iconModal}
                  onClick={isBooking ? handleAlert : handleClose}
                >
                  <CloseIcon />
                </IconButton>
                <Typography
                  className={classes.modal__date__delete}
                  variant="subtitle2"
                  onClick={() => setBookingTime([null, null])}
                >
                  X??a ng??y
                </Typography>
              </div>

              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                locale={locale}
              >
                <StaticDateRangePicker
                  disablePast
                  displayStaticWrapperAs="desktop"
                  value={bookingTime}
                  className={classes.booking__datepicker}
                  onChange={(newValue) => {
                    setBookingTime(newValue);
                  }}
                  renderInput={(startProps, endProps) => (
                    <Fragment>
                      <TextField {...startProps} />
                      <Box sx={{ mx: 2 }}> to </Box>
                      <TextField {...endProps} />
                    </Fragment>
                  )}
                />
              </LocalizationProvider>
              <div className={classes.booking__container}>
                <div className={classes.booking__content}>
                  <Box
                    display={isBooking ? "block" : "flex"}
                    flexDirection="column"
                  >
                    <div>
                      <Typography
                        variant="h5"
                        className={classes.booking__content__price}
                      >
                        {formMoney(detailRoom?.price)}
                        <Typography variant="span">/????m</Typography>
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="body2">
                        {!isBooking && (
                          <Fragment>
                            <Typography
                              variant="span"
                              className={classes.booking__dateTime}
                            >
                              {moment(bookingTime[0]).format("Do MMM")} -
                              <Typography variant="span">
                                {moment(bookingTime[1]).format("Do MMM")}
                              </Typography>
                            </Typography>
                          </Fragment>
                        )}
                      </Typography>
                    </div>
                  </Box>

                  <Button
                    onClick={() => setOpen(false)}
                    className={
                      isBooking
                        ? classes.booking__content__btn__save__isBooking
                        : classes.booking__content__btn__save
                    }
                  >
                    L??u
                  </Button>
                </div>
              </div>
            </div>
          )}
          {open.modalGuest && (
            <div className={classes.pay_modal_guest}>
              <div className={classes.modal__header}>
                <IconButton className={classes.iconModal} onClick={handleClose}>
                  <CloseIcon />
                </IconButton>
                <Typography
                  className={classes.modal__date__delete}
                  variant="subtitle2"
                  onClick={() =>
                    setNumbersFilter({
                      ...numbersFilter,
                      _adult: 1,
                      _children: 0,
                      _toddler: 0,
                    })
                  }
                >
                  X??a
                </Typography>
                <div></div>
              </div>
              <div style={{ padding: 20 }}>
                <GuestCount
                  numbersFilter={numbersFilter}
                  setNumbersFilter={setNumbersFilter}
                />
              </div>
              <div className={classes.drawer_content_bot}>
                <Typography
                  variant="h5"
                  className={classes.booking__content__price}
                >
                  {numbersFilter._adult + numbersFilter._children} kh??ch
                  {numbersFilter._toddler !== 0
                    ? `, ${numbersFilter._toddler} em b??`
                    : null}
                </Typography>
                <Button
                  onClick={() => setOpen(false)}
                  className={classes.booking__content__btn__save}
                >
                  L??u
                </Button>
              </div>
            </div>
          )}
        </Dialog>
        <SwipeableDrawer
          anchor="bottom"
          open={open.modalGuest}
          onClose={toggleDrawer("modalGuest", false)}
          onOpen={toggleDrawer("modalGuest", true)}
          // onClose={handleClose}
          className={classes.pay_drawer_guest}
        >
          <div>
            <div className={classes.modal__header}>
              <IconButton className={classes.iconModal} onClick={handleClose}>
                <CloseIcon />
              </IconButton>
              <Typography
                variant="h5"
                className={classes.booking__content__price}
              >
                {numbersFilter._adult} kh??ch
              </Typography>
              <div></div>
            </div>
            <div style={{ padding: 20 }}>
              <GuestCount
                numbersFilter={numbersFilter}
                setNumbersFilter={setNumbersFilter}
              />
            </div>
            <div className={classes.drawer_content_bot}>
              <Typography
                className={classes.modal__date__delete}
                variant="subtitle2"
                onClick={() =>
                  setNumbersFilter({
                    ...numbersFilter,
                    _adult: 1,
                    _children: 0,
                    _toddler: 0,
                  })
                }
              >
                X??a
              </Typography>

              <Button
                onClick={() => setOpen(false)}
                className={classes.booking__content__btn__save}
              >
                L??u
              </Button>
            </div>
          </div>
        </SwipeableDrawer>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert onClose={handleCloseSnackbar} severity="success">
            Vui l??ng ch???n ng??y
          </Alert>
        </Snackbar>
      </Container>
    </div>
  );
};

export default Pay;
