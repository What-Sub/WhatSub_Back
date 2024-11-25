const GraphModel = require('./graph-model');

class ShortestCostModel {
  constructor() {
    this.graph = {}; // 그래프를 저장할 객체
  }

  /**
   * Build the graph using data from the GraphModel
   */
  async buildGraph() {
    if (Object.keys(this.graph).length > 0) {
      console.log('✅ Graph already built. Skipping rebuild.');
      return this.graph; // 그래프가 이미 생성된 경우 반환
    }

    try {
      const graphModel = new GraphModel();
      this.graph = await graphModel.buildGraph(); // 그래프 생성
      console.log('✅ Graph successfully built.');
      return this.graph;
    } catch (error) {
      console.error('❌ Error building graph:', error.message);
      throw new Error('Failed to build the graph.');
    }
  }

  /**
   * Convert cost into formatted string (₩ 단위)
   * @param {Number} cost - Cost in raw number
   * @returns {String} - Formatted cost (e.g., "3,000원")
   */
  static formatCost(cost) {
    return `${cost.toLocaleString('ko-KR')}원`;
  }

  /**
   * Convert seconds into hours, minutes, and seconds
   * @param {Number} seconds - Time in seconds
   * @returns {String} - Time formatted as "X시간 Y분 Z초"
   */
  static formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours > 0 ? `${hours}시간 ` : ''}${minutes > 0 ? `${minutes}분 ` : ''}${remainingSeconds}초`;
  }

  /**
   * Calculate the minimum cost path using Dijkstra's Algorithm
   * @param {Number} startStation - Starting station number
   * @param {Number} endStation - Destination station number
   * @returns {Object} - Path details including total cost, total time, and transfers
   */
  async calculateShortestCostPath(startStation, endStation) {
    try {
      // 그래프가 없으면 생성
      await this.buildGraph();

      const costs = {};
      const times = {}; // 각 역까지의 누적 시간
      const previous = {};
      const visited = new Set();
      const priorityQueue = [];

      // Initialize costs, times, and priority queue
      Object.keys(this.graph).forEach((node) => {
        costs[node] = Infinity;
        times[node] = Infinity;
      });
      costs[startStation] = 0;
      times[startStation] = 0;

      priorityQueue.push({ station: startStation, cost: 0 });

      while (priorityQueue.length > 0) {
        // Sort queue to get the station with the lowest cost
        priorityQueue.sort((a, b) => a.cost - b.cost);
        const { station: currentStation } = priorityQueue.shift();

        if (visited.has(currentStation)) continue;
        visited.add(currentStation);

        if (currentStation === endStation) break;

        // Update costs and times for neighbors
        this.graph[currentStation].forEach(({ toNode, costWeight, timeWeight, lineNumber }) => {
          const newCost = costs[currentStation] + costWeight;
          const newTime = times[currentStation] + timeWeight;

          if (newCost < costs[toNode]) {
            costs[toNode] = newCost;
            times[toNode] = newTime;
            previous[toNode] = { fromStation: currentStation, lineNumber, costWeight, timeWeight };
            priorityQueue.push({ station: toNode, cost: newCost });
          }
        });
      }

      // Build the path
      const rawPath = [];
      let currentStation = endStation;
      while (currentStation) {
        const prev = previous[currentStation];
        if (!prev) break;
        rawPath.unshift({
          fromStation: prev.fromStation,
          toStation: currentStation,
          lineNumber: prev.lineNumber,
          costOnLine: prev.costWeight,
          timeOnLine: prev.timeWeight,
        });
        currentStation = prev.fromStation;
      }

      // Merge segments with the same lineNumber
      const transfers = [];
      rawPath.forEach((segment) => {
        const lastTransfer = transfers[transfers.length - 1];
        if (lastTransfer && lastTransfer.lineNumber === segment.lineNumber) {
          lastTransfer.toStation = segment.toStation;
          lastTransfer.costOnLine += segment.costOnLine;
          lastTransfer.timeOnLine += segment.timeOnLine;
        } else {
          transfers.push({ ...segment });
        }
      });

      // Format costOnLine and timeOnLine in transfers
      transfers.forEach((transfer) => {
        transfer.costOnLine = ShortestCostModel.formatCost(transfer.costOnLine);
        transfer.timeOnLine = ShortestCostModel.formatTime(transfer.timeOnLine);
      });

      return {
        startStation,
        endStation,
        totalCost: ShortestCostModel.formatCost(costs[endStation]), // Convert total cost
        totalTime: ShortestCostModel.formatTime(times[endStation]), // Convert total time
        transfers,
      };
    } catch (error) {
      console.error('❌ Error calculating shortest cost path:', error.message);
      throw new Error('Failed to calculate shortest cost path.');
    }
  }
}

module.exports = ShortestCostModel;
