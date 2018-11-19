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

const formatCoupon = couponInfo => {
  // 5600MB 080-xxxx-xxxx
  // ------ 080-yyyy-yyyy
  //----------------------
  // [
  //   { giga: <number>, numbers: string[] }
  //   { giga: <number>, numbers: string[] }
  // ]
  return couponInfo.map(service => {
    const { coupon: coupons, hdoInfo: hdoInfos } = service
    const simCoupons = hdoInfos
      .map(hdoInfo => hdoInfo.coupon)
      .reduce((prev, coupons) => [...prev, ...coupons], [])
    const giga = [...coupons, ...simCoupons]
      .map(x => x.volume)
      .reduce((prev, volume) => prev + volume)
    const phones = hdoInfos.map(hdoInfo => ({
      phoneNumber: hdoInfo.number,
      couponUse: hdoInfo.couponUse,
      regulation: hdoInfo.regulation,
    }))
    return { giga, phones }
  })
}

module.exports = { formatCouponInfo, formatCoupon }
