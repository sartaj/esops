import conf from 'conf';

const connected = (callback) => {
  callback(features);
};

export default () => {
  const features = {
    storage
  }

  return (callback) => {
    callback(features)
  }
}