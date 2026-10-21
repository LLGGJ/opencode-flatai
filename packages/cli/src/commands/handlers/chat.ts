import { Option } from "effect"
import start from "./default"

export default () =>
  start({
    directory: Option.none(),
    server: Option.none(),
    standalone: true,
    auto: false,
    yolo: false,
    dangerouslySkipPermissions: false,
    continue: false,
    session: Option.none(),
    prompt: Option.none(),
  })
