// @flow
const _serverFormat: string = process.env.REACT_APP_SERVER_TIMESTAMP_FORMAT || "YYYY-MM-DD HH:mm:ss"

type Format = (string: string) => string;
type Moment = {
  format: Format,
  utc: () => Moment,
};

export const getServerTimestamp = (moment: Moment): ?string => {
  return moment && moment.utc().format(_serverFormat)
}
