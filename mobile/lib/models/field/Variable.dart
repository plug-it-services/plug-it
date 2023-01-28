import 'package:json_annotation/json_annotation.dart';
import 'package:mobile/models/types.dart';

part 'Variable.g.dart';

@JsonSerializable()
class Variable {
  String key, type, displayName, description;

  Variable({required this.key, required this.type, required this.displayName, required this.description});

  factory Variable.fromJson(Json json) => _$VariableFromJson(json);

  Json toJson() => _$VariableToJson(this);
}