import { Button, Menu, Typography } from "@material-ui/core";
import { DateRangePicker } from '@mui/x-date-pickers-pro'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { Box } from "@mui/system";
import queryString from "query-string";
import React, { useState } from "react";
import { BsFillStarFill } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import BookingPrice from "../../../../../components/BookingPrice";
import ButtonSubmit from "../../../../../components/ButtonSubmit";
import GuestCount from "../../../../../components/GuestCount";
import { createAction } from "../../../../../store/action/createAction/createAction";
import { SHOW_MODAL_RATED } from "../../../../../store/types/ListRoomType";
import { formMoney } from "../../../../../utilities/helper";
import useStyles from "./style";
import moment from "moment";
import { USERID } from "../../../../../constants/config";
import { SHOW_MODAL_SIGNIN } from "../../../../../store/types/AuthType";
import { ExpandLess, ExpandMore } from "@material-ui/icons";

const BookingTablet = ({
  bookingTime,
  setBookingTime,
  locale,
  totalDate,
  isBooking,
  detailRoom,
  detailRating,
  queryParams,
}) => {
  const classes = useStyles();
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const dispatch = useDispatch();
  const isUserId = localStorage.getItem(USERID);
  const handleShowRating = () => {
    dispatch(createAction(SHOW_MODAL_RATED));
  };

  const [numbersFilter, setNumbersFilter] = useState({
    _adult: Number(queryParams._adult) || 1,
    _children: Number(queryParams._children) || 0,
    _toddler: Number(queryParams._toddler) || 0,
  });

  const [anchorEl, setAnchorEl] = useState(null);
  const history = useHistory();
  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleClickSave = () => {
    setAnchorEl(null);
    const params = {
      ...queryParams,
      _adult: numbersFilter._adult,
      _children: numbersFilter._children,
      _toddler: numbersFilter._toddler,
    };
    history.push({
      search: queryString.stringify(params),
    });
  };
  const handleClickBooking = () => {
    if (!isUserId) {
      dispatch(createAction(SHOW_MODAL_SIGNIN));
    } else {
      const params = {
        ...queryParams,
        _checkIn: moment(bookingTime[0]).format("YYYY-MM-DD"),
        _checkOut: moment(bookingTime[1]).format("YYYY-MM-DD"),
      };
      history.push({
        pathname: `/pay/${detailRoom._id}`,
        search: queryString.stringify(params),
      });
    }
  };

  return (
    <div className={classes.room__booking__content}>
      <div>
        {totalDate < 30 && totalDate > 0 ? (
          <Typography variant="body2" className={classes.room__booking__price}>
            {formMoney(detailRoom?.price)}
            <Typography variant="span">/????m</Typography>
          </Typography>
        ) : (
          <Typography variant="body2" className={classes.room__booking__price}>
            {formMoney(detailRoom?.price * 25)}
            <Typography variant="span">/th??ng</Typography>
          </Typography>
        )}

        <Typography variant="span" className={classes.room__booking__rating}>
          <BsFillStarFill />
          {detailRoom?.locationId?.valueate}
          <Button disableRipple onClick={handleShowRating}>
            ( {detailRating?.length} ????nh gi??)
          </Button>
        </Typography>
      </div>

      {/* date picker */}
      <div className={classes.room__booking__datepicker}>
        <LocalizationProvider dateAdapter={AdapterDateFns} locale={locale}>
          <DateRangePicker
            open={openDatePicker}
            onClose={() => setOpenDatePicker(false)}
            okText="X??c nh???n"
            cancelText="H???y"
            startText="Nh???n ph??ng"
            endText="Tr??? ph??ng"
            toolbarTitle="Ch???n ng??y"
            clearText="x??a ph??ng"
            disablePast
            value={bookingTime}
            showToolbar
            onChange={(newValue) => {
              setBookingTime(newValue);
            }}
            renderInput={(startProps, endProps) => (
              <React.Fragment>
                <div className={classes.room__booking__datepicker__content}>
                  <div>
                    <Typography
                      variant="body2"
                      className={classes.rook__booking__label}
                    >
                      NH???N PH??NG
                    </Typography>
                    <input
                      {...startProps.inputProps}
                      ref={startProps.inputRef}
                      className={classes.room__booking__input}
                      onClick={() => setOpenDatePicker(true)}
                      placeholder="Th??m ng??y"
                    />
                  </div>

                  <div>
                    <Typography
                      variant="body2"
                      className={classes.rook__booking__label}
                    >
                      TR??? PH??NG
                    </Typography>
                    <input
                      {...endProps.inputProps}
                      ref={endProps.inputRef}
                      className={classes.room__booking__input}
                      onClick={() => setOpenDatePicker(true)}
                      placeholder="Th??m ng??y"
                    />
                  </div>
                </div>
              </React.Fragment>
            )}
          />

          {/*  Filter */}
          <div>
            <div
              className={classes.room__booking__filter}
              onClick={handleOpenMenu}
            >
              <div>
                <Typography variant="body2">KH??CH</Typography>
                <Typography variant="span">
                  {numbersFilter._adult + numbersFilter._children} kh??ch
                  {numbersFilter._toddler !== 0
                    ? `, ${numbersFilter._toddler} em b??`
                    : null}
                </Typography>
              </div>
              {anchorEl ? <ExpandLess /> : <ExpandMore />}
            </div>

            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleCloseMenu}
              getContentAnchorEl={null}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
              className={classes.room__booking__filter__menu}
            >
              <GuestCount
                numbersFilter={numbersFilter}
                setNumbersFilter={setNumbersFilter}
              />

              <Box textAlign="right" mt={3}>
                <Button disableRipple onClick={handleClickSave}>
                  L??u
                </Button>
              </Box>
            </Menu>
          </div>
        </LocalizationProvider>
      </div>
      <div>
        {isBooking ? (
          <ButtonSubmit
            text="Ki???m tra t??nh tr???ng c??n ph??ng"
            handleSubmit={() => setOpenDatePicker(true)}
          />
        ) : (
          <ButtonSubmit text="  ?????t ph??ng" handleSubmit={handleClickBooking} />
        )}
      </div>

      {!isBooking && (
        <div>
          <Typography
            variant="body1"
            className={classes.room__booking__payment_note}
          >
            B???n v???n ch??a b??? tr??? ti???n
          </Typography>
          <BookingPrice totalDate={totalDate} detailRoom={detailRoom} />
        </div>
      )}
    </div>
  );
};

export default BookingTablet;
