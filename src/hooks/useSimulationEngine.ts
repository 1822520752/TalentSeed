"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  SimulationEngine,
  createDefaultAgents,
  type Agent,
  type WorldVariables,
  type WorldEvent,
  type EmergentBehavior,
  type SimulationStatistics,
  type SimulationState,
} from "@/lib/simulation-engine";

/**
 * 仿真引擎Hook返回类型
 */
interface UseSimulationEngineReturn {
  state: SimulationState | null;
  isRunning: boolean;
  agents: Agent[];
  events: WorldEvent[];
  emergentBehaviors: EmergentBehavior[];
  statistics: SimulationStatistics | null;
  time: number;
  variables: WorldVariables | null;
  start: () => void;
  stop: () => void;
  updateVariables: (variables: Partial<WorldVariables>) => void;
  injectCrisis: (intensity: number) => void;
  getAgent: (id: string) => Agent | undefined;
}

/**
 * 仿真引擎Hook
 */
export function useSimulationEngine(
  initialVariables?: Partial<WorldVariables>
): UseSimulationEngineReturn {
  const engineRef = useRef<SimulationEngine | null>(null);
  const [state, setState] = useState<SimulationState | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    engineRef.current = new SimulationEngine(initialVariables);

    createDefaultAgents().forEach((agent) => {
      engineRef.current?.addAgent(agent);
    });

    const unsubscribe = engineRef.current.subscribe((newState) => {
      setState({ ...newState, agents: new Map(newState.agents) });
      setIsRunning(engineRef.current?.getIsRunning() ?? false);
    });

    if (engineRef.current) {
      setState(engineRef.current.getState());
    }

    return () => {
      unsubscribe();
      engineRef.current?.stop();
    };
  }, []);

  const start = useCallback(() => {
    engineRef.current?.start();
    setIsRunning(true);
  }, []);

  const stop = useCallback(() => {
    engineRef.current?.stop();
    setIsRunning(false);
  }, []);

  const updateVariables = useCallback((variables: Partial<WorldVariables>) => {
    engineRef.current?.updateVariables(variables);
  }, []);

  const injectCrisis = useCallback((intensity: number) => {
    engineRef.current?.injectCrisis(intensity);
  }, []);

  const getAgent = useCallback((id: string) => {
    return engineRef.current?.getAgent(id);
  }, []);

  return {
    state,
    isRunning,
    agents: state?.agents ? Array.from(state.agents.values()) : [],
    events: state?.events ?? [],
    emergentBehaviors: state?.emergentBehaviors ?? [],
    statistics: state?.statistics ?? null,
    time: state?.time ?? 0,
    variables: state?.variables ?? null,
    start,
    stop,
    updateVariables,
    injectCrisis,
    getAgent,
  };
}
