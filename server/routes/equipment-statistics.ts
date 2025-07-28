import { RequestHandler } from "express";
import { EquipmentStatistics } from "@shared/api";

export const handleEquipmentStatistics: RequestHandler = (req, res) => {
  const response: EquipmentStatistics = {
    total: 45,
    by_status: {
      "в работе": 32,
      "выключено / не в работе": 8,
      "выведено из эксплуатации": 4,
      "удалено": 1
    },
    by_type: {
      "Сервер": 18,
      "Виртуальный сервер": 15,
      "Сетевое оборудование": 7,
      "Электропитание": 3,
      "Система хранения": 2
    }
  };
  res.status(200).json(response);
};