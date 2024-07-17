import { sleep, check } from 'k6';
import ws from 'k6/ws';
import { Rate, Counter, Trend } from 'k6/metrics';

// Define custom metrics
const openRate = new Rate('ws_open_rate');
const messageRate = new Rate('ws_message_rate');
const closeRate = new Rate('ws_close_rate');
const errorRate = new Rate('ws_error_rate');
const sentMessages = new Counter('ws_sent_messages');
const receivedMessages = new Counter('ws_received_messages');
const messageDuration = new Trend('ws_message_duration');

export let options = {
  stages: [
    { duration: '10s', target: 1000 },
    { duration: '20s', target: 1000 },
    { duration: '10s', target: 0 },
  ],
};

export default function () {
  errorRate.add(0);
  const url = 'ws://localhost:8080';
  const params = { tags: { my_tag: 'hello' } };

  const response = ws.connect(url, params, function (socket) {
    let startTime;

    socket.on('open', function () {
      openRate.add(1);
      socket.send('Hello WebSocket Server!');
      sentMessages.add(1);
      startTime = new Date();
    });

    socket.on('message', function (message) {
      const endTime = new Date();
      const duration = endTime - startTime;
      messageDuration.add(duration);
      messageRate.add(1);
      receivedMessages.add(1);
      check(message, {
        'message is hello': (msg) => msg === 'Hello WebSocket Client!',
      });
      socket.close();
    });

    socket.on('close', function () {
      closeRate.add(1);
      // console.log('WebSocket connection closed');
    });

    socket.on('error', function (e) {
      errorRate.add(1);
      // console.log('WebSocket error:', e.error());
    });
  });

  check(response, { 'status is 101': (r) => r && r.status === 101 });
}