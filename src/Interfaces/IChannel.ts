import {IPlugin} from "./IPlugin";

export interface IChannel{
    channelName:string;
    pluginsList: Array<IPlugin>;
}