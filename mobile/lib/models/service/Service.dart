import 'package:mobile/models/types.dart';
import 'package:json_annotation/json_annotation.dart';

part 'Service.g.dart';

@JsonSerializable()
class Service {
  String name, authType, icon;
  bool connected;

  Service({required this.name, required this.authType, required this.icon, required this.connected});

  factory Service.fromJson(Json json) => _$ServiceFromJson(json);

  Json toJson() => _$ServiceToJson(this);
}