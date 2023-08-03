import {
    DndContext,
    KeyboardSensor,
    MouseSensor,
    rectIntersection,
    TouchSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {useEffect, useState} from "react";
import {Flex, Stack} from "@mantine/core";
import {AddTaskCard, KanbanColumn} from "@/components";
import TasksData from "../../mocks/KanbanTasks.json";

export type KanbanTask = {
    title: string
    id?: string
    status?: "to do" | "in progress" | "done" | "unassigned" | string
    comments?: number
    users?: number
}

const KanbanBoard = () => {
    const [todoItems, setTodoItems] = useState<KanbanTask[]>([]);
    const [doneItems, setDoneItems] = useState<KanbanTask[]>([]);
    const [inProgressItems, setInProgressItems] = useState<KanbanTask[]>([]);
    const [uItems, setuItems] = useState<KanbanTask[]>([]);
    const arrayLanes = [
        {
            title: "To Do",
            items: todoItems,
        },
        {
            title: "In Progress",
            items: inProgressItems,
        },
        {
            title: "Done",
            items: doneItems,
        },
        {
            title: "Unassigned",
            items: uItems,
        },
    ]
    const mouseSensor = useSensor(MouseSensor);
    const touchSensor = useSensor(TouchSensor);
    const keyboardSensor = useSensor(KeyboardSensor);

    const addNewCard = (title: string) => {
        setuItems([...uItems, {title}]);
    };

    useEffect(() => {
        const uiAssigned = TasksData.filter(t => t.status.toLowerCase() === "unassigned"),
            done = TasksData.filter(t => t.status.toLowerCase() === "done"),
            inProgress = TasksData.filter(t => t.status.toLowerCase() === "in progress"),
            todo = TasksData.filter(t => t.status.toLowerCase() === "to do");

        setuItems(uiAssigned);
        setDoneItems(done);
        setInProgressItems(inProgress);
        setTodoItems(todo);
    }, [TasksData]);

    const sensors = useSensors(
        mouseSensor,
        touchSensor,
        keyboardSensor,
    );

    return (
        <DndContext
            collisionDetection={rectIntersection}
            sensors={sensors}
            onDragEnd={(e) => {
                const container = e.over?.id;
                const title = e.active.data.current?.title || "";
                const index = e.active.data.current?.index || 0;
                const parent = e.active.data.current?.parent || "ToDo";

                if (container === "ToDo") {
                    setTodoItems([...todoItems, {title}]);
                } else if (container === "Done") {
                    setDoneItems([...doneItems, {title}]);
                } else if (container === "Unassigned") {
                    setuItems([...uItems, {title}]);
                } else {
                    setInProgressItems([...inProgressItems, {title}]);
                }
                if (parent === "ToDo") {
                    setTodoItems([
                        ...todoItems.slice(0, index),
                        ...todoItems.slice(index + 1),
                    ]);
                } else if (parent === "Done") {
                    setDoneItems([
                        ...doneItems.slice(0, index),
                        ...doneItems.slice(index + 1),
                    ]);
                } else if (parent === "Unassigned") {
                    setuItems([...uItems.slice(0, index), ...uItems.slice(index + 1)]);
                } else {
                    setInProgressItems([
                        ...inProgressItems.slice(0, index),
                        ...inProgressItems.slice(index + 1),
                    ]);
                }
            }}
        >
            <Stack>
                <AddTaskCard addCard={addNewCard}/>
                <Flex gap="sm">
                    {arrayLanes.map(({title, items}, index) => (
                        <KanbanColumn
                            key={index}
                            title={title}
                            items={items}
                            sx={{flex: '1 1 0'}}
                        />
                    ))}
                </Flex>
            </Stack>
        </DndContext>
    );

}

export default KanbanBoard
