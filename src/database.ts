import mongoose from 'mongoose';
import config from "./config";

const connect = () => mongoose.connect(config.DB_CONNECTION_URL);

export default {
    connect
}
