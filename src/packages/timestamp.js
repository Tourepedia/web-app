const _serverFormat= process.env.REACT_APP_SERVER_TIMESTAMP_FORMAT

export const getServerTimestamp = (moment) => {
  return moment && moment.utc().format(_serverFormat)
}
