import {Event} from "./Event";
import {Result} from "./Result";

export type CommandResponse = Result<Event | Event[] | string>;
