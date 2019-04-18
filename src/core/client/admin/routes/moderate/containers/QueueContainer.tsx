import React from "react";
import { RelayPaginationProp } from "react-relay";

import { IntersectionProvider } from "talk-framework/lib/intersection";

import Queue, { QueueComments, QueueSettings } from "../components/Queue";

export interface QueueContainerProps {
  relay: RelayPaginationProp;
}

export default abstract class QueueContainer<P extends QueueContainerProps> extends React.Component<P> {
  public state = {
    disableLoadMore: false,
  };

  protected danglingLogic = (status: string) => ["ACCEPTED", "REJECTED"].indexOf(status) >= 0;

  public render() {
    return (
      <IntersectionProvider>
        <Queue
          comments={this.getComments()}
          settings={this.getSettings()}
          onLoadMore={() => this.handleLoadMore()}
          hasMore={this.props.relay.hasMore()}
          disableLoadMore={this.state.disableLoadMore}
          danglingLogic={this.danglingLogic}
          emptyMessage={this.getEmptyQueueMessage()}
        />
      </IntersectionProvider>
    );
  }

  protected abstract getComments(): QueueComments;

  protected abstract getSettings(): QueueSettings;

  protected abstract getEmptyQueueMessage(): string;

  protected handleLoadMore() {
    if (!this.props.relay.hasMore() || this.props.relay.isLoading()) {
      return;
    }
    this.setState({ disableLoadMore: true });
    this.props.relay.loadMore(
      10, // Fetch the next 10 feed items
      error => {
        this.setState({ disableLoadMore: false });
        if (error) {
          // tslint:disable-next-line:no-console
          console.error(error);
        }
      }
    );
  };
}
