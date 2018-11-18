const formatCouponInfo = couponInfo =>
  couponInfo.reduce((prev, service) => {
    const { coupon: coupons, hdoInfo: hdoInfos } = service
    const simCoupons = hdoInfos
      .map(hdoInfo => hdoInfo.coupon)
      .reduce((prev, coupons) => [...prev, ...coupons], [])
    const giga = [...coupons, ...simCoupons]
      .map(x => x.volume)
      .reduce((prev, volume) => prev + volume)
    return { ...prev, [service.hddServiceCode]: giga }
  }, {})

module.exports = { formatCouponInfo }
