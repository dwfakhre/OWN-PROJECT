import { get_room } from "../controllers/room_controllers.js";
import { Token } from "../models/SpotifyTokens.js";

export var get_tokens = async (session_id) => {
  try {
    const tokens = await Token.findOne((User = session_id));
    return tokens;
  } catch (error) {
    console.log(error);
  }
  return false;
};

export var update_or_create_token = async (temp) => {
  const token = get_tokens(temp.User);

  if (!token) {
    const new_token = new Token(temp);
    try {
      await new_token.save();
      return new_token;
    } catch (error) {
      console.log(error);
    }
  } else {
    const id = { _id: token.id };
    try {
      const new_token = await Token.findOneAndUpdate(id, temp, { new: true });
      return new_token;
    } catch (error) {
      console.log({ message: error.message });
    }
  }
};

export var is_authenticated = async (session_id) => {
  const token = get_tokens(session_id);
  if (token) {
    const date = new Date();
    if (token.expiren_in <= date) {
      var refresh_token = token.refresh_token;
      const token = await refresh_token(refresh_token);
      return true;
    } else {
      return true;
    }
  }
  return false;
};

export var refresh_token = async (refresh_token) => {
  var authOptions = {
    url: "https://accounts.spotify.com/api/token",
    headers: {
      Authorization:
        "Basic " +
        new Buffer(client_id + ":" + client_secret).toString("base64"),
    },
    form: {
      grant_type: "refresh_token",
      refresh_token: refresh_token,
    },
    json: true,
  };

  request.post(authOptions, async (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const exp = body.expires_in;
      const expires = new Date();
      expires.setSeconds(expires.getSeconds() + exp);
      var temp = {
        User: req.session.id,
        access_token: body.access_token,
        refresh_token: refresh_token,
        token_type: body.token_type,
        expires_in: expires,
      };
        const token = await update_or_create_token(temp);
        
    }
  });
    return token;
};
