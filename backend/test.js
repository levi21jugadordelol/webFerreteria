import bcrypt from "bcrypt";

const hash = "$2b$10$bdWy/0PrcDFF98pu7XVMquwLHcTkkEkCEJcmUiVl5WlAJ08zSnue2";

const run = async () => {
  const result = await bcrypt.compare("123456", hash);
  console.log("COMPARE WITH DB HASH:", result);
};

run();
