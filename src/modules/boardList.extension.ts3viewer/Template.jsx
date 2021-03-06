"use strict";

import React from "react";
import {isEmpty, keys} from "lodash";
import Moment from "moment";
import $ from "jquery";
import User from "./User.jsx";

export default class TS3Viewer extends React.Component {
    static propTypes = {
        cacheLifetime: React.PropTypes.number.isRequired,
        debug: React.PropTypes.func.isRequired,
        domInserted: React.PropTypes.func.isRequired,
        nickname: React.PropTypes.string.isRequired,
        refreshInterval: React.PropTypes.number.isRequired,
        wcfProxy: React.PropTypes.func.isRequired
    };
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        this.getJson();
        setInterval(() => this.getJson(), this.props.refreshInterval);
        this.props.domInserted();
    }
    componentDidUpdate() {
        this.props.domInserted();
    }
    ajaxSuccess(data) {
        this.setState(data);

        const updateIn = (data.lastUpdate + this.props.cacheLifetime) - Date.now();
        this.props.debug("Neue Daten werden in %s Sekunden abgefragt", updateIn / 1000);
        setTimeout(() => this.getJson(), updateIn);
    }
    ajaxError(error) {
        this.setState({error});
        return this.props.debug("Teamspeak API meldet einen Fehler: ", error);
    }
    getJson() {
        this.props.debug("Frage Teamspeak Daten ab...");

        $.getJSON(BPP_TS_DOMAIN)
            .done((data) => {
                if (data.error) {
                    return this.ajaxError(data.error);
                }
                this.ajaxSuccess(data);
            })
            .fail((jqXHR, textStatus, errorThrown) => {
                this.props.debug("fail", {jqXHR, textStatus, errorThrown});
                this.ajaxError(textStatus);
            });
    }
    getTimeElement(moment) {
        moment.local();
        return (<time
            className="datetime"
            data-date={moment.format("D. MMMM YYYY")}
            data-offset="7200"
            data-time={moment.format("HH:mm")}
            data-timestamp={moment.unix()}
            dateTime={moment.toISOString()}
        >{moment.format("D. MMMM YYYY, HH:mm")}</time>);
    }
    render() {
        this.props.debug("Render template...", this.state);
        if (isEmpty(this.state)) {
            return false;
        }

        if (this.state.error) {
            return (
                <div className="box32">
                    <span className="icon icon32 icon-headphones"></span>
                    <div className="error" style={{marginTop: 0}}>{this.state.error}</div>
                </div>
            );
        }

        const connectHref = "ts3server://" + this.state.address + "?port=" + this.state.port + "&amp;nickname=" + this.props.nickname;
        const uptime = Moment.duration(this.state.uptime, "s").humanize();

        return (
            <div className="box32">
                <span className="icon icon32 icon-headphones"></span>
                <div>
                    <div className="containerHeadline">
                        <h3>
                            <a href={connectHref}>{this.state.name} - {this.state.welcomemessage}</a> <span className="badge">{keys(this.state.clientlist).length}</span>
                        </h3>
                        <p>
                            {this.state.platform} {this.state.version}
                            &nbsp;- Clients: {keys(this.state.clientlist).length}/{this.state.maxclients}
                            &nbsp;- Channels: {keys(this.state.channellist).length}
                            &nbsp;- Online seit: {uptime}
                            &nbsp;- Letzte Aktualisierung: {this.getTimeElement(Moment.utc(new Date(this.state.lastUpdate)))}
                        </p>
                    </div>
                    <ul className="dataList">
                        {keys(this.state.clientlist).map((name) => {
                            const channelId = this.state.clientlist[name];
                            return (<User
                                channel={this.state.channellist[channelId]}
                                key={name}
                                name={name}
                                wcfProxy={this.props.wcfProxy}
                            />);
                        })}
                    </ul>
                </div>
            </div>
        );
    }
}
