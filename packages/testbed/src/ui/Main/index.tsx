import React, { useEffect, useReducer, useRef } from "react";
import { useRouter } from "react-router-ts";

import { useManager } from "../../manager";
import { TestEntry } from "../../test";
import { TestControl } from "../../testControls";
import { getTestLink } from "../../utils/reactUtils";

interface TestComponentProps {
    entry: TestEntry;
    setTestControls: (controls: TestControl[]) => void;
}

export type TextTable = Array<[string, string]>;
export type TextTableSetter = (table: TextTable) => void;

function tableReducer(state: TextTable, action: TextTable) {
    if (JSON.stringify(state) !== JSON.stringify(action)) return action;
    return state;
}

interface TextTableRowProps {
    label: string;
    value: string;
}

const TextTableRow = ({ label, value }: TextTableRowProps) => {
    if (value === "!") {
        return (
            <tr>
                <th colSpan={2}>{label}</th>
            </tr>
        );
    }
    if (value === "-") {
        return (
            <tr>
                <td colSpan={2}>{label}</td>
            </tr>
        );
    }
    return (
        <tr>
            <td>{label}</td>
            <td>{value}</td>
        </tr>
    );
};

interface TextTableProps {
    id: string;
    table: TextTable;
}

const TextTable = ({ id, table }: TextTableProps) => (
    <div id={id}>
        <table>
            <tbody>
                {table.map(([label, value], index) => (
                    <TextTableRow key={index} label={label} value={value} />
                ))}
            </tbody>
        </table>
    </div>
);

const TestMain = ({ entry: { name, TestClass }, setTestControls }: TestComponentProps) => {
    const [leftTable, setLeftTable] = useReducer(tableReducer, []);
    const [rightTable, setRightTable] = useReducer(tableReducer, []);
    const glCanvasRef = useRef<HTMLCanvasElement>(null);
    const debugCanvasRef = useRef<HTMLCanvasElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const manager = useManager();
    const router = useRouter();
    const activeTest = useActiveTestEntry();
    useEffect(() => {
        const glCanvas = glCanvasRef.current;
        const debugCanvas = debugCanvasRef.current;
        const wrapper = wrapperRef.current;
        if (glCanvas && debugCanvas && wrapper) {
            const loop = () => {
                window.requestAnimationFrame(loop);
                manager.SimulationLoop();
            };
            const init = () => {
                const setTest = (test: TestEntry) => router.history.push(getTestLink(test));
                manager.init(glCanvas, debugCanvas, wrapper, setTest, setLeftTable, setRightTable, setTestControls);
                window.requestAnimationFrame(loop);
            };
            window.requestAnimationFrame(init);
        }
    }, [debugCanvasRef.current, glCanvasRef.current, wrapperRef.current, manager]);

    useEffect(() => {
        manager.setTest(name, TestClass);
    }, [manager, TestClass]);

    return (
        <main ref={wrapperRef}>
            <canvas ref={glCanvasRef} />
            <canvas ref={debugCanvasRef} />
            <TextTable id="left_overlay" table={leftTable} />
            <div id="title_overlay">{activeTest?.name ?? ""}</div>
            <TextTable id="right_overlay" table={rightTable} />
        </main>
    );
};

export function useActiveTestEntry() {
    const router = useRouter();
    const link = decodeURIComponent(router.path);
    const manager = useManager();

    return manager.flatTests.find((test) => getTestLink(test) === link);
}

interface MainProps {
    setTestControls: (controls: TestControl[]) => void;
}

export const Main = ({ setTestControls }: MainProps) => {
    const entry = useActiveTestEntry();
    return entry ? (
        <TestMain entry={entry} setTestControls={setTestControls} />
    ) : (
        <main>Select a test from the menu in the top left corner</main>
    );
};
