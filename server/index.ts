import { app } from './src/app';
import { env } from './src/config/env';

app.listen(env.PORT, () => {
  console.log(`🌬️ AirWhere server running on port ${env.PORT}`);
});
