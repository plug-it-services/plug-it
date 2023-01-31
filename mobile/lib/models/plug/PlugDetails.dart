import 'package:mobile/models/plug/PlugEvent.dart';
import 'package:mobile/models/types.dart';
import 'package:json_annotation/json_annotation.dart';

part 'PlugDetails.g.dart';

@JsonSerializable()
class PlugDetails {
  String id, name;
  bool enabled;
  PlugEvent? event;
  List<PlugEvent> actions;

  PlugDetails({required this.id, required this.name, required this.event, required this.enabled, required this.actions});

  factory PlugDetails.fromJson(Json json) => _$PlugDetailsFromJson(json);

  Json toJson() => _$PlugDetailsToJson(this);

}