const axios = require("axios");
const url = "https://account.it.chula.ac.th";

function postman_to_obj(con) {
  // _.assign({}, {}, {}) = union object
  return _.assign(
    ..._.map(con, obj => ({
      [obj.key]: obj.value
    }))
  );
}

export function getToken(username, password) {
  let host = window.location.origin + "#/login";
  let raw_headers = [
    { key: "Pragma", value: "no-cache" },
    { key: "Cache-Control", value: "no-cache" },
    { key: "Accept", value: "application/json, text/javascript, */*; q=0.01" },
    { key: "X-Requested-With", value: "XMLHttpRequest" },
    {
      key: "Content-Type",
      value: "application/x-www-form-urlencoded; charset=UTF-8"
    },
    { key: "Accept-Language", value: "en,da;q=0.9" }
  ];
  let raw_params = [
    { key: "username", value: username.slice(0, 8) },
    { key: "password", value: password },
    { key: "service", value: host },
    { key: "serviceName", value: "Chula ML" }
  ];
  let headers = postman_to_obj(raw_headers);
  let params = postman_to_obj(raw_params);
  console.log(headers);
  console.log(params);
  return axios.post(url + "/login", {}, { headers, params }).then(result => {
    if (result.data.type == "error") {
      throw "username or password is wrong";
    }
    return result.data;
  });
}

export function verifyToken(ticket) {
  const {
    DeeAppId,
    DeeAppSecret,
    DeeTicket
  } = require("./sso_config.js").default;
  console.log(DeeAppId, DeeAppSecret);
  return axios
    .post(
      url + "/serviceValidation",
      {},
      {
        headers: {
          DeeAppId,
          DeeAppSecret,
          DeeTicket: ticket
        }
      }
    )
    .then(result => {
      if (result.data.type == "error") {
        throw "username or password is wrong";
      }
      return result.data;
    });
}
