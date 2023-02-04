import 'package:flutter/material.dart';
import 'package:mobile/models/types.dart';
import 'package:json_annotation/json_annotation.dart';
import 'package:mobile/ui-toolkit/PlugItStyle.dart';

part 'Service.g.dart';

@JsonSerializable()
class Service {
  String name, authType, icon;
  bool connected;
  Color color;

  Service({required this.name, required this.authType, required this.icon, required this.connected, required this.color});

  factory Service.fromJson(Json json) => _$ServiceFromJson(json);

  Json toJson() => _$ServiceToJson(this);
}