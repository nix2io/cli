/*
 * File: Node.ts
 * Created: 10/26/2020 19:56:00
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */

import { CommandContext } from '.';

export default abstract class Node {
    abstract run(_: CommandContext): string[];
}
