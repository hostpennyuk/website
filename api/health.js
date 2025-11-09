module.exports = async (req, res) => {
  res.status(200).json({ ok: true, message: 'HostPenny API is running' });
};
